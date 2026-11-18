import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { cacheTagPrismicPages, getPreviewRef } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page({ params }: PageProps<"/product/[uid]">) {
	const { uid } = await params;
	const page = await getPage(uid, await getPreviewRef());

	return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateStaticParams() {
	const client = createClient();
	const pages = await client.getAllByType("product");

	return pages.map((page) => ({ uid: page.uid }));
}

async function getPage(uid: string, ref?: string) {
	"use cache";
	cacheLife("max");
	const client = createClient();
	const page = await client.getByUID("product", uid, { ref }).catch(() => notFound());
	cacheTagPrismicPages([page]);
	return page;
}