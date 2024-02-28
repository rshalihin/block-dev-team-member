import { RichText, useBlockProps } from "@wordpress/block-editor";
import { Icon } from "@wordpress/components";

export default function save({ attributes }) {
    const { name, bio, url, alt, id, socialLinks } = attributes;
    return (
        <div {...useBlockProps.save()}>
            {url && (
                <img
                    src={url}
                    alt={alt}
                    className={id ? `wp-image-${id}` : null}
                />
            )}
            {name && <RichText.Content value={name} tagName="h4" />}
            {bio && <RichText.Content value={bio} tagName="p" />}
            {socialLinks.length > 0 && (
                <div className="wp-block-ct-block-team-member-icon-link">
                    <ul>
                        {socialLinks.map((item, index) => {
                            return (
                                <li key={index} data-icon={item.icon}>
                                    <a href={item.link}>
                                        <Icon icon={item.icon} />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}