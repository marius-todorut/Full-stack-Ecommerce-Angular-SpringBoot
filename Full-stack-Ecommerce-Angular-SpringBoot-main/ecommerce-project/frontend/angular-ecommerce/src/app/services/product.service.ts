import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    // call the REST api based on the productUrl
    return this.httpClient.get<Product>(productUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      // map the JSON data from Spring Data REST to ProductCategory array
      map(response => response._embedded.productCategory)
    );
  }

  getProductListPaginate(thePage: number, thePageSize: number, categoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      // map the JSON data from Spring Data REST to Products array
      map(response => response._embedded.products)
    );
  }

}

interface GetResponseProducts {
  // unwrap the JSON
  _embedded: {
    products: Product[];
  },
  // pagination data
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  // unwrap the JSON
  _embedded: {
    productCategory: ProductCategory[];
  };
}
