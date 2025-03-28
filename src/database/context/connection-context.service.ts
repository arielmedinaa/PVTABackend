import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectionContextService {
  private static licenseDataMap = new Map<string, any>();

  setLicenseData(requestId: string, data: any) {
    ConnectionContextService.licenseDataMap.set(requestId, data);
  }

  getLicenseData(requestId: string) {
    return ConnectionContextService.licenseDataMap.get(requestId);
  }

  clearLicenseData(requestId: string) {
    ConnectionContextService.licenseDataMap.delete(requestId);
  }
}