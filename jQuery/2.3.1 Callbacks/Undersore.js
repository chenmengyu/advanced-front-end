(function (root) {
  var optionsCache = {};
  var _ = {
    callbacks: function (options) {
      /*
			@param options
					once：函数队列只能执行一次
					unique：往内部队列添加的函数保持唯一，不能重复添加
					stopOnFalse：内部队列里的函数是依次执行的，当某个函数的返回值是false时，停止继续执行剩下的函数
					memorty：当函数队列fire一次过后，内部会记录fire的参数。当下次调用add的时候，会把记录的参数传递给新添加的函数并立即执行这个新添加的函数
      */
      if (typeof options === 'string') {
        options = options.replace(/^\s+|\s+$/, '')
        options = optionsCache[options] || createOptions(options)
      } else {
        options = {}
      }
      var list = [];
      var index, length, testing, memory, start;
      var fire = function (data) {
        // memory保存的是data，即[context, arguments]
        memory = options.memory && data
        index = start || 0;
        start = 0;
        testing = true
        length = list.length
        for(; index < length; index++) {
          // list[index]是一个函数
          if (list[index](data[0], data[1]) === false && options.stopOnFalse) {
            break;
          }
        }
      }

      var self = {
        add: function () {
          var args = Array.prototype.slice.call(arguments);
          start = list.length
          args.forEach(function (fn) {
            if (toString.call(fn) === '[object Function]') {
              if (!options.unique || !self.has(fn)) {
                list.push(fn)
              }
            }
          })

          if (memory) {
            fire(memory)
          }
        },
        has: function( fn ) {
          for (var i = 0; i < list.length; i++) {
            if (list[i] === fn) {
              return true
            }
          }
          return false
        },
        fireWith: function (context, arguments) {
          var args = [context, arguments];
          if (!options.once || !testing) {
            fire(args)
          }
        },
        fire: function () {
          self.fireWith(this, arguments)
        }
      }

      return self
    }
  }

  function createOptions (options) {
    var object = optionsCache[options] = {}
    options.split(/\s+/).forEach(function (value) {
      object[value] = true
    })
    return object
  }

  root._ = _;
})(this)