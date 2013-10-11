// Demo:
// -----------------------------------
// Copy & Paste into the console.
// Optional
//   run test()   => true
//   run test(1) => Error
// newTest = wrap(test, {
//    name: 'test',
//    filename: '/js/danger.js'
// })
// newTest() => true
// newTest(1) =>
//   a console warning (so users can do helpful debugging / know something didn't work)
//   a console log message (would be replaced with a post to a logging backend)


function test(err){
  if (err) throw new Error('Now Entering the Danger Zone.');
  return true;
}

function wrap(fn, meta){
  meta = meta || {};
  meta.name = meta.name || fn.name;

  return function(){
    try {
      return fn.apply(this, arguments);
    } catch(err) {
      new Problem(meta, err);
    }
  }
}

function Problem(meta, err){
  this.setup(meta, err);
  this.log();
}

Problem.prototype = {
  /*
   * Helpers
   */
  setup: function(meta, err) {
    this.attrs = {};
    this.whitelist = [
      {key: 'msg',      name: 'Exception'},
      {key: 'thrower',  name: 'Thrower'},
      {key: 'filename', name: 'Filename'},
      {key: 'ua',       name: 'User Agent'},
      {key: 'location', name: 'Location'},
      {key: 'stack',    name: 'Stack'}
    ];

    this.err(err);
    this.thrower(meta.name);
    this.filename(meta.filename);
    this.msg(err.message);
    this.ua(navigator.userAgent);
    this.location(JSON.stringify(window.location));
    this.stack(err.stack);
  },

  value: function(name, options){
    // setter
    if (typeof options.attr !== "undefined" && options.attr !== null) {
      return this.set(name, options);
    }
    // getter
    return this.attrs[name];
  },

  set: function(name, options){
    this.attrs[name] = options.attr || options.emptyMessage;
    return this.attrs[name];
  },

  log: function(){
    if (console && console.log){
      console.warn('JavaScript Error', this.err());

      var logs = [],
          len = this.whitelist.length,
          item, i;

      for (i = 0; i < len; i++){
        item = this.whitelist[i];
        logs.push(item.name + ': ' + this[item.key].call(this));
      }
      console.log(logs.join('\n'))
      return true;
    }
    return false;
  },


  /*
   * Attributes
   */
  err: function(err){
    return this.value('err', {
      attr: err,
      emptyMessage: 'no error'
    });
  },

  thrower: function(thrower){
    return this.value('thrower', {
      attr: thrower,
      emptyMessage: 'anonymous'
    })
  },

  filename: function(filename){
    return this.value('filename', {
      attr: filename,
      emptyMessage: 'no filename'
    });
  },

  location: function(location){
    return this.value('location', {
      attr: location,
      emptyMessage: 'no location'
    });
  },

  msg: function(msg){
    return this.value('msg', {
      attr: msg,
      emptyMessage: 'no message'
    });
  },

  ua: function(ua){
    return this.value('ua', {
      attr: ua,
      emptyMessage: 'no user agent'
    });
  },

  stack: function(stack){
    return this.value('stack', {
      attr: stack,
      emptyMessage: 'no stack'
    });
  },

};