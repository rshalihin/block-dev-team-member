import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export default function SortableList(props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (
        <li
            className={props.selectedLink === props.index ? 'is-selected' : null}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}>
            <button aria-label={__("Edit Social Link", "team-block")} onClick={() => props.setSelectedLink(props.index)}>
                <Icon icon={props.icon} />
            </button>
        </li>
    );
}