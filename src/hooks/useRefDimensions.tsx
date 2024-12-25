import React from "react";
import Rectangle from "../data_types/Rectangle";

export default function useRefDimensions(ref: React.RefObject<HTMLElement>): Rectangle {
    const [dimensions, setDimensions] = React.useState<Rectangle>({ width: 1, height: 1 });

    const windowResizeEvent = React.useCallback(() => {
        if (ref.current) {
            const boundingRect = ref.current.getBoundingClientRect();
            setDimensions({ width: boundingRect.width, height: boundingRect.height });
        }
    }, [ref]);

    React.useEffect(() => {
        if (ref.current) {
            const boundingRect = ref.current.getBoundingClientRect();
            setDimensions({ width: boundingRect.width, height: boundingRect.height });
        }

        window.addEventListener('resize', windowResizeEvent);

        return () => {
            window.removeEventListener('resize', windowResizeEvent);
        };
    }, [ref, windowResizeEvent]);

    return dimensions;
}
