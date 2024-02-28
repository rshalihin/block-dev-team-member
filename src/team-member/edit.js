import { useEffect, useState, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { usePrevious } from "@wordpress/compose";
import { useBlockProps, RichText, MediaPlaceholder, BlockControls, MediaReplaceFlow, InspectorControls, store as blockEditorStore } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { isBlobURL, revokeBlobURL } from "@wordpress/blob";
import { Spinner, withNotices, ToolbarButton, PanelBody, TextareaControl, SelectControl, Icon, Tooltip, TextControl, Button, Slot } from "@wordpress/components";
import { DndContext, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import SortableList from "./SortableList";


function Edit({ attributes, setAttributes, noticeOperations, noticeUI, isSelected }) {

    const { name, bio, url, alt, id, socialLinks } = attributes;

    const [blobURL, setBlobURL] = useState();
    const [selectedLink, setSelectedLink] = useState();

    const prevIsSelected = usePrevious(isSelected);
    const prevUrl = usePrevious(url);
    const titleRef = useRef();

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    }));

    const onNameChange = (newName) => {
        setAttributes({ name: newName });
    }
    const onBioChange = (newBio) => {
        setAttributes({ bio: newBio });
    }
    const onSelectImage = (newImage) => {
        if (!newImage || !newImage.url) {
            setAttributes({ url: undefined, id: undefined, alt: '' });
            return;
        }
        setAttributes({ url: newImage.url, id: newImage.id, alt: newImage.alt });
    }
    const onSelectImageUrl = (newImageUrl) => {
        setAttributes({ url: newImageUrl.url, id: undefined, alt: '' });
    }
    const onImageError = (message) => {
        noticeOperations.removeAllNotices();
        noticeOperations.createErrorNotice(message);

    }

    const onImageRemove = () => {
        setAttributes({ url: undefined, id: undefined, alt: '' });
    }
    const onImageAltChange = (newAlt) => {
        setAttributes({ alt: newAlt });
    }
    const onChangeImageSize = (newUrl) => {
        setAttributes({ url: newUrl });
    }

    // will return all image sizes -wp.data.select("core").getMedia(id)
    const imageObjects = useSelect((select) => {
        const { getMedia } = select("core");
        return id ? getMedia(id) : null;
    }, [id]);
    // will return image sizes name form theme -wp.data.select("core/block-editor").getSettings()
    const imageSizes = useSelect((select) => {
        return select(blockEditorStore).getSettings().imageSizes;
    }, []);

    const getImageSizeOptions = () => {
        if (!imageObjects) return [];
        const options = [];
        const sizes = imageObjects.media_details.sizes;
        for (const key in sizes) {
            const size = sizes[key];
            const imageSize = imageSizes.find(s => s.slug === key);
            if (imageSize) {
                options.push({
                    label: imageSize.name,
                    value: size.source_url,
                });
            }

        }
        return options;
    };

    const onAddSocialIcon = () => {
        setAttributes({ socialLinks: [...socialLinks, { icon: 'wordpress', link: 'wordpress.org' }] });
        setSelectedLink(socialLinks.length);
    };

    // Update Social Icon and Link
    const onUpdateSocialItem = (type, value) => {
        const socialLinksCopy = [...socialLinks];
        socialLinksCopy[selectedLink][type] = value;
        setAttributes({ socialLinks: socialLinksCopy });
    };

    //Remove Social Link From Array by Slicing
    const onRemoveSocialLink = () => {
        setAttributes({
            socialLinks: [
                ...socialLinks.slice(0, selectedLink),
                ...socialLinks.slice(selectedLink + 1),
            ],
        });
        setSelectedLink();
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = socialLinks.findIndex((i) => active.id === `${i.icon}-${i.link}`);
            const newIndex = socialLinks.findIndex((i) => over.id === `${i.icon}-${i.link}`);

            setAttributes({
                socialLinks: arrayMove(socialLinks, oldIndex, newIndex)
            })
            setSelectedLink(newIndex);
        }
    }

    // Fist time check and clear blob url
    useEffect(() => {
        if (!id && isBlobURL(url)) {
            setAttributes({ url: undefined, alt: '' });
        }
    }, []);

    // Effect everytime url change and clear browser blob data.
    useEffect(() => {
        if (isBlobURL(url)) {
            setBlobURL(url)
        } else {
            revokeBlobURL(blobURL);
            setBlobURL();
        }
    }, [url]);

    //Effect for focusing in title after upload image
    useEffect(() => {
        if (url && !prevUrl && isSelected) {
            titleRef.current.focus();
        }
    }, [url, prevUrl]);

    // Effect for icon unselected if click outsied of block
    useEffect(() => {
        if (prevIsSelected && !isSelected) {
            setSelectedLink();
        }
    }, [isSelected, prevIsSelected]);

    return (
        <>
            {url && !isBlobURL(url) &&
                <InspectorControls>
                    <PanelBody title={__("Image Settings", "team-block")}>
                        {id &&
                            <SelectControl label={__("Image Alt Text", "team-block")} options={getImageSizeOptions} value={url} onChange={onChangeImageSize} />
                        }
                        <TextareaControl label={__("Image Alt Text", "team-block")} value={alt} onChange={onImageAltChange} help={__("Alternative text descripe your image to people can't see it. And a short description with it's key details", "team-block")} />
                    </PanelBody>
                </InspectorControls>
            }

            {url &&
                <BlockControls group="inline">
                    <MediaReplaceFlow
                        name={__("Replace Image", "team-block")}
                        onSelect={onSelectImage}
                        onSelectURL={onSelectImageUrl}
                        accept="image/*"
                        allowedTypes={['image']}
                        mediaId={id}
                        mediaURL={url}
                    />
                    <ToolbarButton onClick={onImageRemove}>
                        {__("Remove img", "team-block")}
                    </ToolbarButton>
                </BlockControls>
            }

            <div {...useBlockProps()}>
                {url &&
                    <div className={`wp-block-ct-block-team-member-img${isBlobURL(url) ? ' is-loading' : ''}`}>
                        <img src={url} alt={alt} />
                        {isBlobURL(url) && <Spinner />}
                    </div>
                }
                <MediaPlaceholder
                    icon={'admin-users'}
                    onSelect={onSelectImage}
                    onSelectURL={onSelectImageUrl}
                    accept="image/*"
                    allowedTypes={['image']}
                    onError={onImageError}
                    disableMediaButtons={url}
                    notices={noticeUI}
                />
                <RichText placeholder={__("Member name", "team-block")} tagName="h4" value={name} onChange={onNameChange} ref={titleRef} />
                <RichText placeholder={__("Member Bio", "team-block")} tagName="p" value={bio} onChange={onBioChange} />

                <div className="wp-block-ct-block-team-member-icon-link">
                    <ul>
                        <DndContext
                            sensors={sensors}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToHorizontalAxis]}
                        >
                            <SortableContext
                                items={socialLinks.map((item) => `${item.icon}-${item.link}`)}
                                strategy={horizontalListSortingStrategy}
                            >
                                {socialLinks.map((item, index) => {
                                    return (
                                        <>
                                            <SortableList key={`${item.icon}-${item.link}`} id={`${item.icon}-${item.link}`} index={index} selectedLink={selectedLink} setSelectedLink={setSelectedLink} icon={item.icon} />
                                        </>
                                    );
                                })}
                            </SortableContext>
                        </DndContext>

                        {isSelected &&
                            <li className="wp-block-ct-block-team-member-add-icon-li">
                                <Tooltip text={__("Add Social Link", "team-block")}>
                                    <button aria-label={__("Add Social Link", "team-block")} onClick={onAddSocialIcon}>
                                        <Icon icon="plus" />
                                    </button>
                                </Tooltip>
                            </li>
                        }
                    </ul>
                </div>
                {selectedLink !== undefined &&
                    <div className="wp-block-ct-block-team-member-link-form">
                        <TextControl
                            label={__("Icon", "team-block")}
                            value={socialLinks[selectedLink].icon}
                            onChange={(icon) => { onUpdateSocialItem('icon', icon) }}
                        />

                        <TextControl
                            label={__("Social Address", "team-block")}
                            value={socialLinks[selectedLink].link}
                            onChange={(link) => { onUpdateSocialItem('link', link) }}
                        />
                        <br />
                        <Button isDestructive onClick={onRemoveSocialLink}>{__("Remove Links", "team-block")}
                        </Button>
                    </div>
                }
            </div>
        </>
    )
}
export default withNotices(Edit);