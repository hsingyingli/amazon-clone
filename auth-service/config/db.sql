CREATE TABLE users (
	id bigserial primary key not null,
	username varchar(50) not null,
	email varchar(100) not null unique,
	password varchar(300) not null UNIQUE,
	created_at TIMESTAMP not null DEFAULT(now()),
	updated_at TIMESTAMP not null DEFAULT(now())
);
