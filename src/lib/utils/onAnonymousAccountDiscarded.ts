import { GleamAccount } from '$lib/schema';
import { Group } from 'jazz-tools';

export async function onAnonymousAccountDiscarded(anonymousAccount: GleamAccount) {
	const { root: anonymousAccountRoot } = await anonymousAccount.ensureLoaded({
		resolve: {
			root: {
				myMoments: {
					$each: true
				}
			}
		}
	});

	const me = await GleamAccount.getMe().ensureLoaded({
		resolve: {
			root: {
				myMoments: true
			}
		}
	});

	for (const moment of anonymousAccountRoot.myMoments) {
		if (moment.isDeleted) continue;
		const momentGroup = moment._owner.castAs(Group);
		momentGroup.addMember(me, 'admin');
		for (const photo of moment?.photos || []) {
			if (!photo) continue;
			photo._owner.castAs(Group).addMember(me, 'admin');
		}
		me.root.myMoments.push(moment);
	}
}
