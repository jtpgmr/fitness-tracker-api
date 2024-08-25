import axios from 'axios';

const healthOptions = [
    'alcohol-free', 
    'celery-free',
    'crustacean-free',
    'dairy-free',
    'dash',
    'egg-free',
    'fish-free',
    'fodmap-free',
    'gluten-free',
    'keto-friendly',
    'kidney-friendly',
    'kosher',
    'low-potassium',
    'lupine-free',
    'mediterranean',
    'mustard-free',
    'low-fat-abs',
    'no-oil-added',
    'low-sugar',
    'paleo',
    'peanut-free',
    'pecatarian',
    'pork-free',
    'red-meat-free',
    'sesame-free',
    'shellfish-free',
    'soy-free',
    'sugar-conscious',
    'tree-nut-free',
    'vegan',
    'vegetarian',
    'wheat-free',
] as const;

const categories = ['generic-foods', 'generic-meals', 'packaged-foods', 'fast-foods'] as const;

type OptionalQueryParams = {
	ingr?: string;
	brand?: string;
	upc?: string;
	nutritionType?: string;
	calories?: string;
	health?: (typeof healthOptions)[number];
	category?: (typeof categories)[number];
	imageUrl?: string;
	nutrients: {
		CA?: string;
		'CHOCDF.net'?: string;
		CHOCDF?: string;
		CHOLE?: string;
		ENERC_KCAL?: string;
		FAMS?: string;
		FAPU?: string;
		FAT?: string;
		FIBTG?: string;
		FOLDFE?: string;
		FOLFD?: string;
		FOLAC?: string;
		FE?: string;
		K?: string;
		MG?: string;
		NA?: string;
		NIA?: string;
		P?: string;
		PROCNT?: string;
		RIBF?: string;
		SUGAR?: string;
		'SUGAR.alcohol'?: string;
		'SUGAR.added'?: string;
		THIA?: string;
		TOCPHA?: string;
		VITA_RAE?: string;
		VITB12?: string;
		VITB6A?: string;
		VITC?: string;
		VITD?: string;
		VITK1?: string;
		WATER?: string;
		ZN?: string;
	};
};

type NutrientsReqBodyFields = {
	quantity?: number;
	measureUri: string;
	foodId: string;
};

export default class EdamamFoodDatabaseAPIInterface {
    baseUrl: string = 'https://api.edamam.com/api/food-database/v2';

    parserEndpoint: string = this.baseUrl + '/parser';

    nutrientsEndpoint: string = this.baseUrl + '/nutrients';

    appId: string;

    appKey: string;

    constructor({ appId, appKey }: { appId: string; appKey: string }) {
        this.appId = appId;
        this.appKey = appKey;
    }

    async callParser(queryObj: OptionalQueryParams) {
        const res = await axios({
            method: 'get',
            url: this.parserEndpoint,
            params: {
                ...queryObj,
                appId: this.appId,
                appKey: this.appKey,
            },
        });

        // console.log(res.data);

        // return res.hints;
    }

    async callNutrients({ quantity, measureUri, foodId }: NutrientsReqBodyFields) {
        const body = {
            ingredients: [
                {
                    quantity,
                    foodId,
                    measureURI: measureUri,
                },
            ],
        };

        const res = await axios({
            method: 'post',
            url: this.parserEndpoint,
            params: {
                appId: this.appId,
                appKey: this.appKey,
            },
            data: body,
        });

        return res;
    }
}
