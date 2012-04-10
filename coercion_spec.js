describe('coercion',function(){
  beforeEach(function(){
    this.spy = jasmine.createSpy();
  });

  describe('calling the cb', function(){
    beforeEach(function(){
      this.coerced = coercion([
        coercion.required.String, 
        coercion.optional.Boolean
      ], this.spy);
    });
  
    it('throws an error if the reqd type is incorrect', function(){
      var that = this;
      expect(function(){
        that.coerced(true, true);
      }).toThrow("invalid argument type");
    });

    it('throws an error if the function is invoked with too few arguments',function(){
      var that = this;
      expect(function(){
        that.coerced();
      }).toThrow(" wrong number of arguments (0 for 1)");
    });
  
    it('throws an error if the function is invoked with too many arguments', function(){
      var that = this;
      expect(function(){
        that.coerced("1", true, 3);
      }).toThrow(" wrong number of arguments (3 for 2)");
    });
  
    it('passes through the arguments to the callback', function(){
      this.coerced("foo", true);
      expect(this.spy).toHaveBeenCalledWith("foo", true);
    });
  
    it('passes through null where an optional param was omitted', function(){
      this.coerced("foo");
      expect(this.spy).toHaveBeenCalledWith("foo", null);
    });
  });
  
  describe('complex optional behavior', function(){
    it('adds a reqd after a skipped opt', function(){
      this.coerced = coercion([
        coercion.required.String, 
        coercion.optional.Boolean,
        coercion.required.String
      ], this.spy)("string1", "string2");
      expect(this.spy).toHaveBeenCalledWith("string1", null, "string2");
    });
    
    it('handles 1 reqd, 1 opt, 1 reqd', function(){
      this.coerced = coercion([
        coercion.required.String,
        coercion.optional.String,
        coercion.required.String
      ], this.spy)("string1", "string2");
      expect(this.spy).toHaveBeenCalledWith("string1", null, "string2");
    });
    
    it('handles 1 opt, 1 reqd, 1 reqd', function(){
      this.coerced = coercion([
        coercion.optional.String,
        coercion.required.String,
        coercion.required.String
      ], this.spy)("string1", "string2");
      expect(this.spy).toHaveBeenCalledWith(null, "string1", "string2");
    });
    
    it('handles 1 reqd, 1 reqd, 1 opt', function(){
      this.coerced = coercion([
        coercion.required.String,
        coercion.required.String,
        coercion.optional.String
      ], this.spy)("string1", "string2");
      expect(this.spy).toHaveBeenCalledWith("string1", "string2", null);
    });
  });
  
  it('throws an error for 2 optional args of equal types', function(){
    expect(function(){
      this.coerced = coercion([
        coercion.optional.String,
        coercion.optional.String
      ], this.spy);
    }).toThrow();
  });

  it('does not error for 1 opt 1 reqd of equal types', function(){
    expect(function(){
      this.coerced = coercion([
        coercion.optional.String,
        coercion.required.String
      ], this.spy);
    }).not.toThrow();
  });
  
  it('errors for 1 opt, 1 reqd, 1 opt of equal types', function(){
    expect(function(){
      this.coerced = coercion([
        coercion.optional.String,
        coercion.required.String,
        coercion.optional.String
      ], this.spy);
    }).toThrow();
  });

  it('does not error for 1 reqd 1 opt of equal types', function(){
    expect(function(){
       this.coerced = coercion([
        coercion.required.String,
        coercion.optional.String
      ], this.spy);
    }).not.toThrow();
  });
  
});