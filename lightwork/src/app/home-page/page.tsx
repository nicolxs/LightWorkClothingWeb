import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { cacheTagPrismicPages, getPreviewRef } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page() {
	const page = await getPage(await getPreviewRef());

	return <SliceZone slices={page.data.slices} components={components} />;
}

async function getPage(ref?: string) {
	"use cache";
	cacheLife("max");
	const client = createClient();
	const page = await client.getSingle("home_page", { ref }).catch(() => notFound());
	cacheTagPrismicPages([page]);
	return page;
}