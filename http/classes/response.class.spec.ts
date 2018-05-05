import { expect } from 'chai';
import 'mocha';

import { HttpResponse } from './response.class';

describe('Class: HttpResponse', () => {

    let httpResponse: HttpResponse;

    beforeEach(() => {

      // define the class
      const MockRes = function() {
          this.statusVal = null;
          this.jsonVal = null;
      };
      
      MockRes.prototype.json = function(json) {
          this.jsonVal = json;
          return this;
      };
      
      MockRes.prototype.status = function(status) {
          this.statusVal = status;
          return this;
      };

      httpResponse = new HttpResponse(new MockRes());
    });

    it('should handle a successful response', () => {
        
        const testBody = {
            message: 'test'
        };

        httpResponse.success(testBody);

        expect(httpResponse.rawRes['jsonVal']).to.equal(testBody);
        expect(httpResponse.rawRes['statusVal']).to.equal(200);
    });

    it('should handle a created response', () => {
      
      const testBody = {
          message: 'test'
      };

      httpResponse.created(testBody);

      expect(httpResponse.rawRes['jsonVal']).to.equal(testBody);
      expect(httpResponse.rawRes['statusVal']).to.equal(201);
    });

    it('should handle an error with a custom status', () => {
      
      const testBody = {
          message: 'test error'
      };

      const testStatus: number = 403;

      httpResponse.errored(testStatus, testBody);

      expect(httpResponse.rawRes['jsonVal']).to.equal(testBody);
      expect(httpResponse.rawRes['statusVal']).to.equal(testStatus);
    });

    it('should default an error body to {}', () => {

      httpResponse.errored();

      expect(JSON.stringify(httpResponse.rawRes['jsonVal'])).to.equal(JSON.stringify({}));
      expect(httpResponse.rawRes['statusVal']).to.equal(500);
    });

    it('should default an error to status 500', () => {
      
      const testBody = {
          message: 'test error'
      };

      httpResponse.errored(null, testBody);

      expect(httpResponse.rawRes['jsonVal']).to.equal(testBody);
      expect(httpResponse.rawRes['statusVal']).to.equal(500);
    });
  });