import { IData, Query } from "../models/data.model";
import PostModel from '../schemas/data.schema';
import { Document } from 'mongoose';

class DataService {
 
  public async createPost(postParams: IData) {
    try {
      const dataModel = new PostModel(postParams);
      await dataModel.save();
    } catch (error: any) {
      throw new Error(`Wystąpił błąd podczas tworzenia danych: ${error.message}`);
    }
  }

  public async query(query: Query<any>) {
    try {
      const result = await PostModel.find(query, { __v: 0 });
      return result;
    } catch (error: any) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  public async deleteData(query: Query<any>) {
    try {
      await PostModel.deleteMany(query);
    } catch (error: any) {
      throw new Error(`Wystąpił błąd podczas usuwania danych: ${error.message}`);
    }
  }
}

export default DataService;