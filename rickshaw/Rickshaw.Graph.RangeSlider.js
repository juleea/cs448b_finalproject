Rickshaw.namespace('Rickshaw.Graph.RangeSlider');

Rickshaw.Graph.RangeSlider = function(args) {

    var element = this.element = args.element;
    var graph = this.graph = args.graph;
    //added by BJD
    if(graph.constructor === Array){
            $( function() {
                $(element).slider( {
                    range: true,
                    min: graph[0].dataDomain()[0],
                    max: graph[0].dataDomain()[1],
                    values: [ 
                        graph[0].dataDomain()[0],
                        graph[0].dataDomain()[1]
                    ],
                    slide: function( event, ui ) {
                        for(var i=0; i < graph.length; i++){
                        graph[i].window.xMin = ui.values[0];
                        graph[i].window.xMax = ui.values[1];
                        graph[i].update();
        
                        // if we're at an extreme, stick there
                        if (graph[i].dataDomain()[0] == ui.values[0]) {
                            graph[i].window.xMin = undefined;
                        }
                        if (graph[i].dataDomain()[1] == ui.values[1]) {
                            graph[i].window.xMax = undefined;
                        }
                        }
                    }
                } );
            } );
            graph[0].onUpdate( function() {
        
                var values = $(element).slider('option', 'values');
        
                $(element).slider('option', 'min', graph[0].dataDomain()[0]);
                $(element).slider('option', 'max', graph[0].dataDomain()[1]);
        
                if (graph[0].window.xMin == undefined) {
                    values[0] = graph[0].dataDomain()[0];
                }
                if (graph[0].window.xMax == undefined) {
                    values[1] = graph[0].dataDomain()[1];
                }
        
                $(element).slider('option', 'values', values);
        
            } );
    }else{
    $( function() {
        $(element).slider( {
            range: true,
            min: graph.dataDomain()[0],
            max: graph.dataDomain()[1],
            values: [ 
                graph.dataDomain()[0],
                graph.dataDomain()[1]
            ],
            slide: function( event, ui ) {
                //original slide function
                graph.window.xMin = ui.values[0];
                graph.window.xMax = ui.values[1];
                graph.update();

                // if we're at an extreme, stick there
                if (graph.dataDomain()[0] == ui.values[0]) {
                    graph.window.xMin = undefined;
                }
                if (graph.dataDomain()[1] == ui.values[1]) {
                    graph.window.xMax = undefined;
                }
            }
        } );
    } );

    graph.onUpdate( function() {

        var values = $(element).slider('option', 'values');

        $(element).slider('option', 'min', graph.dataDomain()[0]);
        $(element).slider('option', 'max', graph.dataDomain()[1]);

        if (graph.window.xMin == undefined) {
            values[0] = graph.dataDomain()[0];
        }
        if (graph.window.xMax == undefined) {
            values[1] = graph.dataDomain()[1];
        }

        $(element).slider('option', 'values', values);

    } );
    }
};