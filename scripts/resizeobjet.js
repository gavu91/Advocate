var interact=  require('interactjs'); 

interact('.shape') 
.resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    modifiers: [
    // keep the edges inside the parent
    interact.modifiers.restrictEdges({
        outer: 'parent',
        endOnly: true,
    }),

    // minimum size
    interact.modifiers.restrictSize({
        min: { width: 50, height: 50 },
    }),
    ],

    inertia: true
})
.on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
});

interact('table') 
.resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    modifiers: [
    // keep the edges inside the parent
    interact.modifiers.restrictEdges({
        outer: 'parent',
        endOnly: true,
    }),

    // minimum size
    interact.modifiers.restrictSize({
        min: { width: 50, height: 50 },
    }),
    ],

    inertia: true
})
.on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
});