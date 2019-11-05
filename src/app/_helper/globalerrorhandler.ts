import { Router } from '@angular/router';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggingService } from '../_services/logging.service'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) { }
  handleError(error) {
    const logger = this.injector.get(LoggingService);
    logger.logError(error);
  }
}