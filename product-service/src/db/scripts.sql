CREATE extension IF NOT EXISTS "uuid-ossp";

--create tables

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text UNQIUE NOT NULL,
    description text,
    price int,
    src text
);

CREATE TABLE stocks (
    product_id uuid,
	foreign key ("product_id") references "products" ("id"),
	count int
);

--insert table data

INSERT INTO products
    (title, price, src, description)
VALUES
    ('Affenpinscher', '2.4', 'https://images.dog.ceo/breeds/affenpinscher/n02110627_11759.jpg', 'Dog Description 1'),
    ('African', '10', 'https://images.dog.ceo/breeds/african/n02116738_4461.jpg', 'Dog Description 2'),
    ('Airedale', '16', 'https://images.dog.ceo/breeds/airedale/n02096051_8385.jpg', 'Dog Description 3'),
    ('Appenzeller', '5', 'https://images.dog.ceo/breeds/appenzeller/n02107908_7364.jpg', 'Dog Description 4'),
    ('Borzoi', '28', 'https://images.dog.ceo/breeds/borzoi/n02090622_7135.jpg', 'Dog Description 5'),
    ('Beagle', '2', 'https://images.dog.ceo/breeds/beagle/n02088364_3758.jpg', 'Dog Description 6'),
    ('Boxer', '19', 'https://images.dog.ceo/breeds/boxer/n02108089_5614.jpg', 'Dog Description 7'),
    ('Chihuahua', '5', 'https://images.dog.ceo/breeds/chihuahua/n02085620_3407.jpg', 'Dog Description 7');

INSERT INTO stocks
	(product_id, count)
VALUES
	('e502a58c-b8d2-40dc-948f-21609da99481', 10),
	('3e25db57-4b37-473c-9354-35b9329ef99a', 15),
	('00dc7853-aea8-481b-8559-c6de5625351b', 5),
	('e7b2a05b-bb4a-443d-9179-5bfa65cb18e9', 25),
	('428b76cd-c819-43e0-be63-3f5189bbc18b', 10),
	('cfd7b1d9-f19f-4a3b-820b-b3f3e089b168', 10),
	('cd134af9-65d8-4c06-852a-bc44b82c595f', 20),
    ('109fb352-c2d3-4c95-906b-969ad787f139', 15);