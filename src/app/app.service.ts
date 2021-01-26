import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import DataSource from "devextreme/data/data_source";

@Injectable()

export class AppService {
    url: string;
    dataSource: any = {};
    
    constructor(private http: HttpClient){
    }
    getDataSource() {
        this.dataSource = new DataSource({
            load: (loadOption) => {
                return this.http.get('https://localhost:44375/weatherforecast')
                .toPromise()
                .then((data: any) => {
                    return {
                        data: data.data,
                        totalCount: data.totalCount,
                        summary: data.summary,
                        groupCount: data.groupCount
                    };
                })
                .catch(error => { throw 'Data Loading Error' });
            }
        })
    }
}