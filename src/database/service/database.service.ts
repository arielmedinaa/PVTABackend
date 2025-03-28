// src/database/database.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from 'src/users/models/user.entity';

@Injectable()
export class DatabaseService {
  private dataSources = new Map<string, DataSource>();
  
  constructor(private configService: ConfigService) {}

  async createDataSource(licenseData: any): Promise<DataSource> {
    const connectionId = `client_${licenseData.ruc}`;
    
    if (this.dataSources.has(connectionId)) {
      const existingDataSource = this.dataSources.get(connectionId);
      if (existingDataSource?.isInitialized) {
        return existingDataSource;
      }
    }

    const dataSource = new DataSource({
      name: connectionId,
      type: 'postgres',
      host: licenseData.ip,
      port: parseInt(licenseData.port, 10),
      username: 'postgres',
      password: licenseData.pass_database,
      database: licenseData.database_name,
      entities: [User],
      synchronize: false,
      logging: true,
    });
    
    await dataSource.initialize();
    this.dataSources.set(connectionId, dataSource);
    return dataSource;
  }

  getDataSource(ruc: string): DataSource | undefined {
    return this.dataSources.get(`client_${ruc}`);
  }

  async closeAllConnections(): Promise<void> {
    for (const [key, dataSource] of this.dataSources.entries()) {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      this.dataSources.delete(key);
    }
  }
}