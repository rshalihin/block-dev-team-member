import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import save from './save';

registerBlockType('ct-block/team-member', {
    title: __("Team Member", "ct-block"),
    description: __("Single team member", "ct-block"),
    category: "media",
    icon: "admin-users",
    parent: ["ct-block/team-members"],
    attributes: {
        name: {
            type: "string",
            source: "html",
            selector: "h4"
        },
        bio: {
            type: "string",
            source: "html",
            selector: "p"
        },
        id: {
            type: "number"
        },
        url: {
            type: "string",
            source: "attribute",
            selector: "img",
            attribute: "src"
        },
        alt: {
            type: "string",
            source: "attribute",
            selector: "img",
            attribute: "alt",
            default: ""
        },
        socialLinks: {
            type: "array",
            default: [],
            source: 'query',
            selector: '.wp-block-ct-block-team-member-icon-link ul li',
            query: {
                icon: {
                    source: 'attribute',
                    attribute: 'data-icon'
                },
                link: {
                    source: 'attribute',
                    selector: 'a',
                    attribute: 'href'
                },
            },
        },
    },
    supports: {
        html: false,
        reusable: false
    },

    edit: Edit,
    save,
});
