export class Culture {
    idMetier: string;
    libelle: string;
    groupeCultures: {
        idMetier: string,
        libelle: string
    };
}

export class GroupeCulture {
    idMetier: string;
    libelle: string;
}
