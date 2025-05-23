import { Account, Profile, co, CoList, CoMap, ImageDefinition, Group } from 'jazz-tools';

export class GleamProfile extends Profile {
	name = co.string;
}

export class PhotoList extends CoList.Of(co.ref(ImageDefinition)) {}

export class Summary extends CoMap {
	hash = co.string;
	startDate = co.Date;
	endDate = co.Date;
	content = co.string;
}
export class ListOfSummaries extends CoList.Of(co.ref(Summary)) {}

export class Moment extends CoMap {
	date = co.Date;
	content = co.string;
	photos = co.optional.ref(PhotoList);
	isDeleted = co.boolean;
	isPrivate = co.optional.boolean;
}

export class ListOfMoments extends CoList.Of(co.ref(Moment)) {}
export class GleamRoot extends CoMap {
	myMoments = co.ref(ListOfMoments);
	mySummaries = co.ref(ListOfSummaries);
	apiKey = co.optional.string;
}

export class GleamAccount extends Account {
	profile = co.ref(GleamProfile);
	root = co.ref(GleamRoot);

	async migrate(this: GleamAccount, creationProps?: { name: string }) {
		console.log('running migration');
		if (this.root === undefined) {
			console.log(`Migrating account ${this.id}: creating root node`);

			this.root = GleamRoot.create({
				myMoments: ListOfMoments.create([]),
				mySummaries: ListOfSummaries.create([])
			});
		}

		if (this.profile === undefined) {
			const profileGroup = Group.create();
			profileGroup.addMember('everyone', 'reader');
			this.profile = GleamProfile.create({ name: creationProps?.name || '' }, profileGroup);
		}

		const { root } = await this.ensureLoaded({
			resolve: { root: true }
		});
		if (root.myMoments === undefined) {
			console.log(`Migrating account root ${root.id}: creating myMoments list`);
			root.myMoments = ListOfMoments.create([], { owner: this });
		}
		if (root.mySummaries === undefined) {
			console.log(`Migrating account root ${root.id}: creating mySummaries list`);
			root.mySummaries = ListOfSummaries.create([], { owner: this });
		}
	}
}
