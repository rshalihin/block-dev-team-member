import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
	const { columns } = attributes;
	const onColumnChange = (newColumn) => {
		setAttributes({ columns: newColumn });
	}
	return (
		<div {...useBlockProps({
			className: `has-${columns}-columns`
		})}>
			<InspectorControls>
				<PanelBody>
					<RangeControl label={__("Column", "team-block")} min={1} max={6} value={columns} onChange={onColumnChange} />
				</PanelBody>
			</InspectorControls>
			<InnerBlocks allowedBlocks={['ct-block/team-member']}
				orientation="horizontal"
				template={[
					['ct-block/team-member'],
					['ct-block/team-member'],
				]} />
		</div>
	);
}
