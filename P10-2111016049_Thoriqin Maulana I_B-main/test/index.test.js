// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");


describe('Product API Testing', () => {
  // Uji Kasus 1: should return product data with id 1
  test('should return product data with id 1', async () => {
    const productData = await fetchProductsData(1);
    expect(productData.id).toBe(1);
    expect(productData.title).toBe("iPhone 9");
  });

  // Uji Kasus 2: should check products.length with limit
  test('should check products.length with limit', async () => {
    const productData = await fetchProductsData(); 
    const productsCards = setProductsCards(productsData.products);
    const limit = productsData.limit;
    expect(productsCards.length).toBe(limit);
  });

  // Uji Kasus 3: should convert price from dollars to rupiah correctly
  test("should validate product discount calculation", () => {
    const price = 100;
    const discountPercentage = 10;
    const discountedPrice = countDiscount(price, discountPercentage);
    expect(discountedPrice).toBe(90);
  });
});

// Asyncronous Testing
// https://jestjs.io/docs/asynchronous


// Mocking
// https://jestjs.io/docs/mock-functions

const { fetchCartsData } = require("../src/dataService");

jest.mock("../src/dataservice", () => {
  const originalModule = jest.requireActual("../src/dataservice");
  return {
    ...originalModule,
    __esModule: true,
    fetchCartsData: jest.fn(),
  };
});

// Setup & Teardown
// https://jestjs.io/docs/setup-teardown

describe("Cart API Testing", () => {
  // Test case 1
  // Test case ini menggunakan mocking untuk memalsukan hasil panggilan fungsi fetchCartsData 
  // dengan memberikan data palsu dari keranjang yang diambil dari cartData.carts. 
  // Setelah menunggu hasil panggilan asinkron fetchCartsData dan menyimpannya dalam variabel cartsData, 
  // test ini menghitung total item dalam keranjang dan membandingkannya dengan total yang diharapkan dari cartData.total menggunakan expect.
  test("should compare total cart items with length of fetched data", async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);
    const cartsData = await fetchCartsData();
    const totalItems = cartsData.length;
    const expectedTotal = cartData.total;
    expect(totalItems).toBe(expectedTotal);
  });

  // Test case 2
  // test case ini memastikan bahwa ketika fungsi fetchCartsData dipanggil, 
  // total panjang data keranjang sesuai dengan total yang diharapkan dari data palsu yang diberikan melalui mocking.
  test("should compare total length of carts data with total", async () => {
    fetchCartsData.mockResolvedValue([
      { id: 1, productId: 1, quantity: 1 },
      { id: 2, productId: 2, quantity: 2 },
    ]);
    const cartsData = await fetchCartsData();
    const totalLength = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
    expect(totalLength).toBe(3);
  });
});

// Setup & Teardown
// https://jestjs.io/docs/setup-teardown

let productsData; // Variabel untuk menyimpan data produk dari API

// Fetch data produk sebelum menjalankan test suite
beforeAll(async () => {
  productsData = await fetchProductsData();
});

describe("Product Utility Testing", () => {
  describe("convertToRupiah", () => {
    // Test case 1
    // test case ini memastikan bahwa fungsi convertToRupiah dapat mengonversi nilai 100 dolar 
    // dengan benar menjadi format mata uang Rupiah yang diharapkan, dan hasilnya berupa string.
    test("should convert 100 dollars into rupiah", () => {
      const priceInRupiah = convertToRupiah(100);
      expect(priceInRupiah).toMatch(/Rp\s1\.543\.600,\d{2}/);
      expect(typeof priceInRupiah).toBe("string");
    });

    // Test case 2
    // Berfungsi memanggil fungsi convertToRupiah(1000) untuk mengonversi 1000 dolar menjadi format mata uang Rupiah.
    // Menggunakan expect untuk memeriksa apakah hasil konversi (priceInRupiah) sesuai dengan pola yang diharapkan, 
    // yaitu dimulai dengan "Rp" diikuti oleh angka-angka yang sesuai dengan nilai 1000 dolar dan dua digit desimal.
    test("should convert 1000 dollars into rupiah", () => {
      const priceInRupiah = convertToRupiah(1000);
      expect(priceInRupiah).toMatch(/Rp\s15\.436\.000,\d{2}/);
    });
  });

  test("should calculate discount correctly", () => {
    // Test case 1
    // Test case ini menguji fungsi countDiscount 
    // dengan memberikan harga awal sebesar 100,000 dan persentase diskon sebesar 20%.
    const discountedPrice1 = countDiscount(100000, 20);
    expect(discountedPrice1).toBe(80000);

    // Test case 2
    // Test case ini menguji fungsi countDiscount 
    // untuk memastikan bahwa perhitungan harga diskon dilakukan dengan benar.
    const discountedPrice2 = countDiscount(75000, 10);
    expect(discountedPrice2).toBe(67500);
  });

  describe("setProductsCards", () => {
    test("it should return an array of products with specific keys", () => {
      const productsCards = setProductsCards(productsData.products);
      const firstProductKeys = Object.keys(productsCards[0]);
      const expectedKeys = ["price", "after_discount", "image"];
      expect(firstProductKeys).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});