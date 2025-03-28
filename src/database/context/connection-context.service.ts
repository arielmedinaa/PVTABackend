import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ConnectionContextService {
  private licenseData: any = null;

  setLicenseData(data: any) {
    this.licenseData = data;
  }

  getLicenseData() {
    return this.licenseData;
  }
}