CREATE TABLE categories (
	id bigserial primary key not null,
	title varchar(100) not null UNIQUE,
	created_at TIMESTAMP not null DEFAULT(now()),
	updated_at TIMESTAMP not null DEFAULT(now())
);

CREATE TABLE products (
	id bigserial primary KEY not null,
	title varchar(500) not null,
	price int not null,
  amount int not null,
	description TEXT not null,
	imageUrl varchar(200) not null,
	category_id bigint not null,
	created_at TIMESTAMP not null DEFAULT(now()),
	updated_at TIMESTAMP not null DEFAULT(now())
);


ALTER TABLE products 
ADD FOREIGN KEY ("category_id") 
REFERENCES "categories" ("id")
ON DELETE CASCADE;
