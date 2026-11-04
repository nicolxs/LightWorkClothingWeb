import type {
  ContentRelationshipField,
  FilledContentRelationshipField,
  ImageField,
  KeyTextField,
  LinkField,
  RichTextField,
  SelectField,
  TimestampField,
} from "@prismicio/client";

/** The interface for Product documents. */
export type ProductDocument = SimpleDocument<
  "product",
  {
    uid: KeyTextField;
    name: KeyTextField;
    price: number | null;
    images: ImageField[];
    description: RichTextField;
    sizes: SelectField<"S" | "M" | "L" | "XL">[];
    colours: { colour: KeyTextField }[];
    category: SelectField<"Tees" | "Hoodies" | "Accessories">;
    sold_out: boolean | null;
    details: RichTextField;
    meta_title: KeyTextField;
    meta_description: KeyTextField;
  }
>;

/** The interface for Homepage documents. */
export type HomepageDocument = SimpleDocument<
  "homepage",
  {
    hero_mobile_image: ImageField;
    hero_desktop_image: ImageField;
    hero_headline: KeyTextField;
    hero_subline: KeyTextField;
    hero_cta_label: KeyTextField;
    hero_cta_link: LinkField;
    featured_products: {
      product: ContentRelationshipField<"product">;
    }[];
    editorial_image: ImageField;
    editorial_text: RichTextField;
    lookbook_images: { image: ImageField }[];
    newsletter_headline: KeyTextField;
    newsletter_body: KeyTextField;
  }
>;

/** The interface for Story documents. */
export type StoryDocument = SimpleDocument<
  "story",
  {
    title: KeyTextField;
    body: RichTextField;
    founder_quote: KeyTextField;
    images: ImageField[];
    values: { title: KeyTextField; description: KeyTextField }[];
  }
>;

/** The interface for Gallery documents. */
export type GalleryDocument = SimpleDocument<
  "gallery",
  {
    images: { image: ImageField; caption: KeyTextField }[];
  }
>;

/** The interface for Settings documents. */
export type SettingsDocument = SimpleDocument<
  "settings",
  {
    logo: ImageField;
    whatsapp_number: KeyTextField;
    instagram_url: LinkField;
    contact_email: KeyTextField;
    announcement_text: KeyTextField;
    delivery_copy: KeyTextField;
    footer_text: KeyTextField;
  }
>;

type BaseDataInterface = {
  first_publication_date: TimestampField;
  last_publication_date: TimestampField;
};

type SimpleDocument<
  TType extends string,
  TData extends Record<string, unknown>,
> = {
  id: string;
  uid: KeyTextField;
  type: TType;
  href: string;
  tags: string[];
  lang: string;
  data: TData & BaseDataInterface;
  slices: never;
};

export type filledProductLink = FilledContentRelationshipField<"product">;
