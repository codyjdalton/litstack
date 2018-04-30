import { expect } from 'chai';
import 'mocha';

import { HttpResponse } from './response.class';

describe('Class: HttpResponse', () => {

    let httpResponse: HttpResponse;

    beforeEach(() => {
        httpResponse = new HttpResponse(null);
    });

    it('should have a default success code', () => {

        expect(httpResponse.defaultSuccessCode).to.haveOwnProperty;
    });

    it('should have a default error code', () => {

        expect(httpResponse.defaultErrorCode).to.haveOwnProperty;
    });
  });