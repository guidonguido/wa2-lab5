# Group 04 (AG Team) - Lab 5

### Labs implemented:

- [x] Lab 2
- [x] Lab 3
- [x] Lab 4
- [x] Lab 5
- [ ] Lab 6
- [ ] Lab 7

### Members

* Andrea Scoppetta - 280612
* Guido Ricioppo - 279127
* Alessio Chiolo - 277934
* Alessandro Lucani - 281755

## How to Test the Application with GraphiQL

Launch the npm application and connect to `[localhost:3000/graphql](http://localhost:3000/graphql)` . Through GraphiQ, a graphical interactive in-browser GraphQL IDE, you can easily test the web server querying your DB.

### - Create a Product

```arduino
mutation {
  productCreate(
    productCreateInput: {
          name : "TestProduct1",
          description : "My first product",
          price :11.1,
          category: FOOD
      }
  ){
    name,
    createdAt,
    description,
    stars,
    price,
    category,
    comments{
      title,
      stars,
      date
    }
  }
}
```

### - Create a Comment related to a Product

First, you have to retrieve the productId of an existing Product; to do so either inspect the DB and copy a productId or query it with Graphql referencing to the "**Get (sorted) Products specifying a filter**" section.

Create multiple comments to see how the stars field of a Product changes

```arduino
mutation {
  commentCreate(
    commentCreateInput: {
    title: "Good Prod",
    body: "Detailed comment description 1",
    stars: 4
    },
    
    productId: "60ac02ff5e512a41db0d5c81")
  {
    	title,
	body,
	stars,
	date
  }
}
```

### - Get Product with given productId

First, you have to retrieve the productId of an existing Product; to do so either inspect the DB and copy a productId or query it with Graphql referencing to the "**Get (sorted) Products specifying a filter**" section.

```arduino
{ 
   product(id: "60ac02ff5e512a41db0d5c81") {
  	name,
     	createdAt,
     	description,
     	stars,
     	price,
  	comments { 
           title,
	   body,
	   stars,
	   date
        }
   } 
}
```

### - Get (sorted) Products specifying a filter

Filter constrains are **optional**. Use an empty filter to get all existing products.

Sorting **value** can be either "*createdAt*" or "*price*"

Sorting **order** can be "*asc*" or "*desc*"

```arduino
{
  products(
    filter: {
      categories: [FOOD],
      minStars: 2,
      minPrice: 1.01,
      maxPrice: 100000.1      
    },
    
    sort: {
      value: price,
      order: desc
    }
  ) {
    	name,
     	createdAt,
     	description,
     	stars,
     	price,
  	comments { 
           title,
	   body,
	   stars,
	   date
        }
  }
}
```
