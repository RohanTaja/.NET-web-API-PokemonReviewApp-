export interface Pokemon {
  id: number;
  name: string;
  birthDate: string;
}

export interface Review {
  id: number;
  title: string;
  text: string;
  rating: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  gym: string;
}

export interface Reviewer {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Country {
  id: number;
  name: string;
}

