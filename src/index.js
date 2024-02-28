import { registerBlockType, createBlock } from '@wordpress/blocks';
import "./team-member";
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType('ct-block/team-members', {
	edit: Edit,
	save,
	transforms: {
		from: [
			{
				type: "block",
				blocks: ["core/gallery"],
				transform: ({ images, columns }) => {
					const innerBlocks = images.map(({ id, alt, url }) => {
						return createBlock('ct-block/team-member', {
							id, alt, url
						})
					});
					return createBlock('ct-block/team-members', {
						columns: columns || 3
					}, innerBlocks)
				}
			},
			{
				type: "block",
				blocks: ["core/image"],
				isMultiBlock: true,
				transform: (attributes) => {
					const innerBlocks = attributes.map(({ id, alt, url }) => {
						return createBlock('ct-block/team-member', {
							id, alt, url
						})
					});
					return createBlock('ct-block/team-members', {
						columns: attributes.length > 3 ? 3 : attributes.length
					}, innerBlocks)
				}
			}
		]
	}
});
