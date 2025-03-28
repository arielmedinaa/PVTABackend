import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../service/database.service';
import { ConnectionContextService } from '../context/connection-context.service';

@Injectable()
export class DatabaseConnectionInterceptor implements NestInterceptor {
  constructor(
    private databaseService: DatabaseService,
    private connectionContext: ConnectionContextService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestId = uuidv4();
    request.requestId = requestId;
    
    if (user) {
      const { licenseId, email } = user;
      
      if (!licenseId) {
        throw new HttpException('No license information in token', HttpStatus.UNAUTHORIZED);
      }
      
      if (user.database_name && user.db_host && user.db_port && user.db_password) {
        const licenseData = {
          ruc: licenseId,
          ip: user.db_host,
          port: user.db_port,
          database_name: user.database_name,
          pass_database: user.db_password
        };
        
        this.connectionContext.setLicenseData(requestId, licenseData);
        await this.databaseService.createDataSource(licenseData);
        
        console.log(`Stored license data with requestId: ${requestId}`);
      } else {
        throw new HttpException('Insufficient database connection details in token', HttpStatus.UNAUTHORIZED);
      }
    }

    return next.handle().pipe(
      finalize(() => {
        // Limpia los datos cuando termina la solicitud
        console.log(`Clearing license data for requestId: ${requestId}`);
        this.connectionContext.clearLicenseData(requestId);
      })
    );
  }
}