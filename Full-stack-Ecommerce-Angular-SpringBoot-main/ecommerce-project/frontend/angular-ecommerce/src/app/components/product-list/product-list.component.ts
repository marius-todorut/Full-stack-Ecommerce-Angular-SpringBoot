import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbPagination],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })

  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    console.log(`In search mode ${this.searchMode}`);
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const keywordParam = this.route.snapshot.paramMap.get('keyword');
    const theKeyword: string = keywordParam !== null ? keywordParam : '';

    // if different keyword, set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`The keyword: ${theKeyword}, thePageNumber = ${this.thePageNumber}`);

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    console.log('Has Category ID:', hasCategoryId);  // Debugging

    if (hasCategoryId) {
      const idParam = this.route.snapshot.paramMap.get('id');
      this.currentCategoryId = idParam !== null ? +idParam : 0;
      console.log('Current Category ID:', this.currentCategoryId);  // Debugging

    }
    else {
      // not available, use default category
      this.currentCategoryId = 1;
      console.log('Default Category ID:', this.currentCategoryId);  // Debugging

    }
    // check if we have a different category than previous
    // reset page number if different category
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // -1 because angular -> pages are 1 based, spring data rest -> pages are 0 based
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const pageSize = +selectElement.value;
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
