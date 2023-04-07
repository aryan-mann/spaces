export function scrollIntoCenterOnDoubleClick(node: HTMLElement) {
    const onDoubleClick = (me: MouseEvent) => {
        me.preventDefault();
        me.stopPropagation();
        node.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    };
    
    node.ondblclick = onDoubleClick;

    return {
        destroy() {
            node.ondblclick = null;
        }
    }
}

export function shouldScrollTo(node: HTMLElement, shouldScroll: boolean) {
    if (!shouldScroll)
        return;

    node.scrollTo({ behavior: "smooth" })
}

export function scrollableByMouse(node: HTMLElement) {
    let mouseState: "up" | "down" = "up";
    let mouseX: null | number = null;
    let mouseDownTimeStamp: null | number = null;

    function OnMouseDown(e: MouseEvent) {
        mouseX = e.pageX;
        mouseDownTimeStamp = e.timeStamp;    
        mouseState = "down";
    }
    function OnMouseUp(e: MouseEvent) {
        mouseState = "up";
        if (mouseX === null || mouseDownTimeStamp === null)
            return;

        let mouseTravelX = mouseX - e.pageX;
        let mouseTravelDuration = e.timeStamp - mouseDownTimeStamp;
        let velocity = (mouseTravelX / mouseTravelDuration);
        let scrollAmount = velocity * 100.0;
        
        e.preventDefault();
        node.scrollBy({ behavior: "smooth", left: scrollAmount });
        mouseX = null;
    }
    function OnMouseMove(e: MouseEvent) {
        if (mouseState !== "down")
            return;
        
        e.preventDefault();
        node.scrollBy((-e.movementX), 0)
    }

    node.onmousedown = OnMouseDown;
    node.onmouseup = OnMouseUp;
    node.onmousemove = OnMouseMove;

    return {
        destroy() {
            node.onmousedown = null;
            node.onmouseup = null;
            node.onmousemove = null;
        }
    }
}