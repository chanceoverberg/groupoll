'use server';

import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
    const rawFormData = {
        name: formData.get('groupName'),
    };
    console.log("group created with name: " + rawFormData.name);
    if (rawFormData.name) {
        redirect(`/${rawFormData.name}`);
    }
}

export async function createPoll(formData: FormData) {
    const rawFormData = {
        title: formData.get('pollTitle'),
        options: formData.getAll('option'),
    };
    console.log("Title: " + rawFormData.title + " Options:");
    rawFormData.options.map((option) => {
        console.log(option);
    })
}