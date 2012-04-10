function coercion(declarations, cb) {
  var numberOfOptional = 0;
  for (var i=0; i<declarations.length; i++) {
    //if it's optional
    if(!declarations[i][0]) {
      numberOfOptional++;
      // if there is a straight of this type that includes another
      // optional arg, we must find it and alert!
      
      for (var j=i+1; j<declarations.length; j++){
        if (declarations[i][1] == declarations[j][1]) {
          if (!declarations[j][0]) {
            throw new Error("ambiguous argument declaration");
          }
        } else {
          // fast forward and get out quick!
          i = j;
          break;
        }
      }
    }
  }

  return function() {
    var args = Array.prototype.slice.call(arguments);
    var coercedArgs = [];
    var numSkipped = 0;
    
    if(args.length > declarations.length){
      throw new Error(cb.name + " wrong number of arguments ("+args.length+" for "+(declarations.length)+")");
    }
    
    if(numberOfOptional + args.length < declarations.length){
      throw new Error(cb.name + " wrong number of arguments ("+args.length+" for "+(declarations.length - numberOfOptional)+")");
    }
    
    var itype = 0;
    for (var i = 0; i<declarations.length; i++){
      var currentArg = args[i - numSkipped];
      if (declarations[i][1] != declarations[itype][1]) {
        itype = i;
      }
      
      if (declarations[i][0]) {
        // required
       if (typeof currentArg === declarations[i][1]) {
         coercedArgs.push(currentArg);
       } else {
        // ok so we think there might be a problem,
        // but let's just double check the last coerced arg types
        // we could have mistaken a reqd for an opt param
        if (itype != i){
          var found = false;
          for (var j=i; j>=itype; j--) {
            if (!declarations[j][0]) {
              // found the optional thing that was left out!
              coercedArgs.splice(j, 0, null);
              found = true;
              break;
            }
          }
          if (!found) {
            throw new Error("invalid argument type");
          }
        } else {
          // damn, it really was a fatal error
          throw new Error("invalid argument type");
        }
       }
      } else {
        // optional
        if (typeof currentArg === declarations[i][1]) {
          // the arg was (most likely?) included!
          coercedArgs.push(currentArg);
        } else {
          numSkipped++;
          coercedArgs.push(null);
        }
      }
    }
    
    cb.apply(this, coercedArgs);
  };
}

coercion.required = {
  String: [true, 'string'],
  Boolean: [true, 'boolean'],
  Function: [true, 'function'],
  Object: [true, 'object']  
};

coercion.optional = {
  String: [false, 'string'],
  Boolean: [false, 'boolean'],
  Function: [false, 'function'],
  Object: [false, 'object']
};
