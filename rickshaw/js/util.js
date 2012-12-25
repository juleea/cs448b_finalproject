jQuery.fn.onEnter = function(callback)
{
    this.keyup(function(e)
    {
        if(e.keyCode == 13)
    {
    e.preventDefault();
    if (typeof callback == 'function')
    callback.apply(this);
    }
    }
    );
    return this;
}


