export interface IResource {
  pages: Pages;
}
interface Pages {
  [key: string]: string;
}

export interface IResourceDb {
  code: string;
  key: string;
  value: string;
}
