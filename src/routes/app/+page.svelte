<script>
	import { auth, db } from '$lib/firebase/firebase.client';
	import { authStore } from '../../stores/AuthStore';
	import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import {
		userData,
		loadUserData,
		loadingUserData,
		savingUserData,
		saveUserData
	} from '$stores/UserStore';
	import {
		courseData,
		loadCourseData,
		loadingCourseData,
		saveCourseData
	} from '$stores/CourseStore';

	let selection = $state(null);

	let courses = $state({});
	let selectionEdit = $derived(JSON.stringify(selection, null, 4));
	// let courseEdit = $derived(JSON.stringify(courses, null, 4));
	let courseEdit = $derived(
		JSON.stringify(
			{
				'Linear Algebra': {
					homework: '60-90',
					type: 'math',
					difficulty: 'hard',
					credits: 10,
					url: '/app/profiles/cca/linear_algebra',
					weighted: false,
					academic: true
				},
				'Integrated Math 2': {
					type: 'math',
					credits: 10,
					homework: '60-90',
					url: '/app/profiles/cca/integrated_math_2',
					difficulty: 'moderate',
					weighted: false,
					academic: true
				},
				'Calculus 3': {
					credits: 5,
					academic: true,
					url: '/app/profiles/cca/calculus_3',
					type: 'math',
					weighted: false,
					difficulty: 'hard',
					homework: '60-90'
				},
				'English 9 Honors': {
					difficulty: 'hard',
					weighted: false,
					credits: 10,
					url: '/app/profiles/cca/english_9_honors',
					homework: '30-60',
					academic: true,
					type: 'english'
				},
				'Advanced Topics in Math': {
					credits: 10,
					difficulty: 'moderate',
					homework: '0-30',
					weighted: false,
					academic: true,
					url: '/app/profiles/cca/advanced_topics_in_math',
					type: 'math'
				},
				'Integrated Math 1/2 Essentials': {
					url: '/app/profiles/cca/integrated_math_1-2_essentials',
					weighted: false,
					homework: '0-30',
					credits: 10,
					difficulty: 'easy',
					type: 'math',
					academic: true
				},
				'AP Calculus BC': {
					academic: true,
					weighted: true,
					homework: '60-90',
					credits: 10,
					url: '/app/profiles/cca/ap_calculus_bc',
					type: 'math',
					difficulty: 'hard'
				},
				'Integrated Math 3 Honors': {
					url: '/app/profiles/cca/integrated_math_3_honors',
					credits: 10,
					difficulty: 'hard',
					homework: '60-90',
					weighted: true,
					academic: true,
					type: 'math'
				},
				'Integrated Math 1': {
					weighted: false,
					academic: true,
					credits: 10,
					difficulty: 'moderate',
					type: 'math',
					url: '/app/profiles/cca/integrated_math_1',
					homework: '60-90'
				},
				'Integrated Math 1 Honors': {
					difficulty: 'hard',
					homework: '60-90',
					weighted: false,
					type: 'math',
					academic: true,
					credits: 10,
					url: '/app/profiles/cca/integrated_math_1_honors'
				},
				Statistics: {
					difficulty: 'moderate',
					academic: true,
					type: 'math',
					url: '/app/profiles/cca/statistics',
					homework: '30-60',
					weighted: false,
					credits: 10
				},
				'Integrated Math 2 Honors': {
					homework: '60-90',
					difficulty: 'hard',
					weighted: false,
					credits: 10,
					type: 'math',
					academic: true,
					url: '/app/profiles/cca/integrated_math_2_honors'
				},
				'Intro to Calculus': {
					academic: true,
					type: 'math',
					credits: 10,
					weighted: false,
					url: '/app/profiles/cca/intro_to_calculus',
					difficulty: 'moderate',
					homework: '30-60'
				},
				'AP Calculus AB': {
					homework: '60-90',
					type: 'math',
					weighted: true,
					url: '/app/profiles/cca/ap_calculus_ab',
					academic: true,
					difficulty: 'hard',
					credits: 10
				},
				'Integrated Math 3': {
					url: '/app/profiles/cca/integrated_math_3',
					credits: 10,
					difficulty: 'moderate',
					homework: '60-90',
					weighted: false,
					type: 'math',
					academic: true
				},
				'Advanced Math for Decision Making': {
					url: '/app/profiles/cca/advanced_math_for_decision_making',
					difficulty: 'easy',
					weighted: false,
					homework: '0-30',
					type: 'math',
					academic: true,
					credits: 10
				},
				'Personal Financial Literacy': {
					type: 'electives',
					credits: 10,
					weighted: false,
					academic: true,
					difficulty: 'easy',
					url: '/app/profiles/cca/personal_financial_literacy',
					homework: '0-30'
				},
				'Integrated Math 1 Readiness': {
					academic: true,
					difficulty: 'easy',
					type: 'math',
					url: '/app/profiles/cca/integrated_math_1_readiness',
					homework: '0-30',
					credits: 10,
					weighted: false
				},
				'AP Statistics': {
					url: '/app/profiles/cca/ap_statistics',
					difficulty: 'hard',
					type: 'math',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'Advanced Journalism': {
					url: '/app/profiles/cca/advanced_journalism',
					difficulty: 'moderate',
					type: 'practical arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'AP English Language': {
					url: '/app/profiles/cca/ap_english_language',
					difficulty: 'hard',
					type: 'english',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '30-60'
				},
				'AP English Literature': {
					url: '/app/profiles/cca/ap_english_literature',
					difficulty: 'hard',
					type: 'english',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'College Application Seminar': {
					url: '/app/profiles/cca/college_application_seminar',
					difficulty: 'easy',
					type: 'electives',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Creative Writing': {
					url: '/app/profiles/cca/creative_writing',
					difficulty: 'easy',
					type: 'electives',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'English 10 Honors': {
					url: '/app/profiles/cca/english_10_honors',
					difficulty: 'hard',
					type: 'english',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '60-90'
				},
				'English 10': {
					url: '/app/profiles/cca/english_10',
					difficulty: 'easy',
					type: 'english',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'English 11': {
					url: '/app/profiles/cca/english_11',
					difficulty: 'easy',
					type: 'english',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'English 12': {
					url: '/app/profiles/cca/english_12',
					difficulty: 'easy',
					type: 'english',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'English 9': {
					url: '/app/profiles/cca/english_9',
					difficulty: 'easy',
					type: 'english',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				Journalism: {
					url: '/app/profiles/cca/journalism',
					difficulty: 'moderate',
					type: 'practical arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Modern Epic': {
					url: '/app/profiles/cca/modern_epic',
					difficulty: 'moderate',
					type: 'english',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '60-90'
				},
				'Speech & Debate': {
					url: '/app/profiles/cca/speech_and_debate',
					difficulty: 'easy',
					type: 'practical arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'AP Art History': {
					url: '/app/profiles/cca/ap_art_history',
					difficulty: 'hard',
					type: 'visual arts',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP Economics': {
					url: '/app/profiles/cca/ap_economics',
					difficulty: 'hard',
					type: 'social science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP European History': {
					url: '/app/profiles/cca/ap_european_history',
					difficulty: 'hard',
					type: 'social science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP Psychology': {
					url: '/app/profiles/cca/ap_psychology',
					difficulty: 'moderate',
					type: 'social science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '30-60'
				},
				'AP Government': {
					url: '/app/profiles/cca/ap_government',
					difficulty: 'hard',
					type: 'social science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP World History': {
					url: '/app/profiles/cca/ap_world_history',
					difficulty: 'hard',
					type: 'social science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				Economics: {
					url: '/app/profiles/cca/economics',
					difficulty: 'moderate',
					type: 'social science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Film & Society': {
					url: '/app/profiles/cca/film_and_society',
					difficulty: 'easy',
					type: 'elective',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				Government: {
					url: '/app/profiles/cca/government',
					difficulty: 'easy',
					type: 'social science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Non-Western World History': {
					url: '/app/profiles/cca/non-western_world_history',
					difficulty: 'easy',
					type: 'social science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Pop Culture': {
					url: '/app/profiles/cca/pop_culture',
					difficulty: 'easy',
					type: 'elective',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				Psychology: {
					url: '/app/profiles/cca/psychology',
					difficulty: 'easy',
					type: 'social science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				Sociology: {
					url: '/app/profiles/cca/sociology',
					difficulty: 'easy',
					type: 'social science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'US History': {
					url: '/app/profiles/cca/us_history',
					difficulty: 'easy',
					type: 'social science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'World History': {
					url: '/app/profiles/cca/world_history',
					difficulty: 'easy',
					type: 'social science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Anatomy & Physiology': {
					url: '/app/profiles/cca/anatomy_and_physiology',
					difficulty: 'moderate',
					type: 'life science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'AP Biology': {
					url: '/app/profiles/cca/ap_biology',
					difficulty: 'hard',
					type: 'life science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP Chemistry': {
					url: '/app/profiles/cca/ap_chemistry',
					difficulty: 'hard',
					type: 'physical science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP Environmental Science': {
					url: '/app/profiles/cca/ap_environmental_science',
					difficulty: 'moderate',
					type: 'physical science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP Physics 1': {
					url: '/app/profiles/cca/ap_physics_1',
					difficulty: 'hard',
					type: 'physical science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP Physics 2': {
					url: '/app/profiles/cca/ap_physics_2',
					difficulty: 'hard',
					type: 'physical science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				'AP Physics C': {
					url: '/app/profiles/cca/ap_physics_c',
					difficulty: 'hard',
					type: 'physical science',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '60-90'
				},
				Biology: {
					url: '/app/profiles/cca/biology',
					difficulty: 'easy',
					type: 'life science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Biotechnology 1': {
					url: '/app/profiles/cca/biotechnology_1',
					difficulty: 'easy',
					type: 'practical arts',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Biotechnology 2': {
					url: '/app/profiles/cca/biotechnology_2',
					difficulty: 'easy',
					type: 'practical arts',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				Chemistry: {
					url: '/app/profiles/cca/chemistry',
					difficulty: 'easy',
					type: 'physical science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Honors Chemistry': {
					url: '/app/profiles/cca/honors_chemistry',
					difficulty: 'moderate',
					type: 'physical science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Organic Chemistry': {
					url: '/app/profiles/cca/organic_chemistry',
					difficulty: 'hard',
					type: 'physical science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '60-90'
				},
				Physics: {
					url: '/app/profiles/cca/physics',
					difficulty: 'easy',
					type: 'physical science',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'AP Chinese': {
					url: '/app/profiles/cca/ap_chinese',
					difficulty: 'hard',
					type: 'world language',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '30-60'
				},
				'AP French': {
					url: '/app/profiles/cca/ap_french',
					difficulty: 'hard',
					type: 'world language',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '30-60'
				},
				'AP Japanese': {
					url: '/app/profiles/cca/ap_japanese',
					difficulty: 'hard',
					type: 'world language',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '30-60'
				},
				'AP Spanish': {
					url: '/app/profiles/cca/ap_spanish',
					difficulty: 'hard',
					type: 'world language',
					academic: true,
					weighted: true,
					credits: 10,
					homework: '30-60'
				},
				'ASL 1': {
					url: '/app/profiles/cca/asl_1',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'ASL 2': {
					url: '/app/profiles/cca/asl_2',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'ASL 3': {
					url: '/app/profiles/cca/asl_3',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'ASL 4': {
					url: '/app/profiles/cca/asl_4',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Chinese 1': {
					url: '/app/profiles/cca/chinese_1',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Chinese 2': {
					url: '/app/profiles/cca/chinese_2',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Chinese 3': {
					url: '/app/profiles/cca/chinese_3',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Chinese 4': {
					url: '/app/profiles/cca/chinese_4',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Chinese 5': {
					url: '/app/profiles/cca/chinese_5',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'French 1': {
					url: '/app/profiles/cca/french_1',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'French 2': {
					url: '/app/profiles/cca/french_2',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'French 3': {
					url: '/app/profiles/cca/french_3',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'French 4': {
					url: '/app/profiles/cca/french_4',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'French 5': {
					url: '/app/profiles/cca/french_5',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Japanese 1': {
					url: '/app/profiles/cca/japanese_1',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Japanese 2': {
					url: '/app/profiles/cca/japanese_2',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Japanese 3': {
					url: '/app/profiles/cca/japanese_3',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Japanese 4': {
					url: '/app/profiles/cca/japanese_4',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Japanese 5': {
					url: '/app/profiles/cca/japanese_5',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Spanish 1': {
					url: '/app/profiles/cca/spanish_1',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Spanish 2': {
					url: '/app/profiles/cca/spanish_2',
					difficulty: 'easy',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Spanish 3': {
					url: '/app/profiles/cca/spanish_3',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Spanish 4': {
					url: '/app/profiles/cca/spanish_4',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Spanish 5': {
					url: '/app/profiles/cca/spanish_5',
					difficulty: 'moderate',
					type: 'world language',
					academic: true,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Dance PE': {
					url: '/app/profiles/cca/dance_pe',
					difficulty: 'easy',
					type: 'physical education',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Fitness Walking': {
					url: '/app/profiles/cca/fitness_walking',
					difficulty: 'easy',
					type: 'physical education',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Intermediate Dance': {
					url: '/app/profiles/cca/intermediate_dance',
					difficulty: 'easy',
					type: 'physical education',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Intro to Dance II': {
					url: '/app/profiles/cca/intro_to_dance_2',
					difficulty: 'easy',
					type: 'physical education',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Year 2 PE': {
					url: '/app/profiles/cca/year_2_pe',
					difficulty: 'easy',
					type: 'physical education',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Sports Performance Training': {
					url: '/app/profiles/cca/sports_performance_training',
					difficulty: 'hard',
					type: 'physical education',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Weight Training': {
					url: '/app/profiles/cca/weight_training',
					difficulty: 'easy',
					type: 'physical education',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Year One PE': {
					url: '/app/profiles/cca/year_1_pe',
					difficulty: 'easy',
					type: 'physical education',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Advanced Video Film': {
					url: '/app/profiles/cca/advanced_video_film',
					difficulty: 'easy',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Advanced Acting': {
					url: '/app/profiles/cca/advanced_acting',
					difficulty: 'hard',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Advanced Chorus': {
					url: '/app/profiles/cca/advanced_chorus',
					difficulty: 'hard',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Advanced Dance': {
					url: '/app/profiles/cca/advanced_dance',
					difficulty: 'hard',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Advanced Digital Photography': {
					url: '/app/profiles/cca/advanced_digital_photography',
					difficulty: 'moderate',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Advanced Drama Honors': {
					url: '/app/profiles/cca/advanced_drama_honors',
					difficulty: 'hard',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Advanced Drawing': {
					url: '/app/profiles/cca/advanced_drawing',
					difficulty: 'moderate',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Advanced Musical Theater Production': {
					url: '/app/profiles/cca/advanced_musical_theater_production',
					difficulty: 'hard',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '30-60'
				},
				'Advanced Sculpture': {
					url: '/app/profiles/cca/advanced_sculpture',
					difficulty: 'moderate',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'Advanced Digital Art and Design': {
					url: '/app/profiles/cca/advanced_digital_art_and_design',
					difficulty: 'moderate',
					type: 'visual arts',
					academic: false,
					weighted: false,
					credits: 10,
					homework: '0-30'
				},
				'AP Studio Art': {
					url: '/app/profiles/cca/ap_studio_art',
					difficulty: 'hard',
					type: 'visual arts',
					academic: false,
					weighted: true,
					credits: 10,
					homework: '0-30'
				},
				'AP Studio Art 3D': {
					url: '/app/profiles/cca/ap_studio_art_3d',
					difficulty: 'hard',
					type: 'visual arts',
					academic: false,
					weighted: true,
					credits: 10,
					homework: '30-60'
				},
				'AP Drawing': {
					url: '/app/profiles/cca/ap_drawing',
					difficulty: 'hard',
					type: 'visual arts',
					academic: false,
					weighted: true,
					credits: 10,
					homework: '0-30'
				}
			},
			null,
			4
		)
	);
	let isSaving = false;
	let isSaved = false;

	let lastLoadedUserId = null;
	let hasInitializedSelection = false;
	let hasInitializedCourses = false;
	let lastCoursesLoaded = { '': '' };

	$effect(() => {
		if (!hasInitializedCourses) {
			loadCourseData().catch((err) => {
				console.error('error loading course data', err);
			});
			hasInitializedCourses = true;
		}
	});

	$effect(() => {
		const data = $courseData;
		if (data && Object.keys(data).length > 0 && lastCoursesLoaded != data) {
			courses = structuredClone(data);
			// courseEdit = JSON.stringify(courses, null, 4);
			lastCoursesLoaded = data;
		}
	});

	// Single effect to handle all auth and data loading logic
	$effect(() => {
		const currentUser = $authStore.currentUser;
		const isLoading = $authStore.isLoading;

		if (!currentUser && !isLoading) {
			// User logged out - clear everything
			if (lastLoadedUserId) {
				lastLoadedUserId = null;
				hasInitializedSelection = false;
			}
		} else if (currentUser && !isLoading) {
			if (lastLoadedUserId !== currentUser.uid) {
				lastLoadedUserId = currentUser.uid;
				hasInitializedSelection = false;
				loadUserData().catch((error) => {
					console.error('Failed to load user data:', error);
					lastLoadedUserId = null;
				});
			}
		}
	});

	// Separate effect for updating UI when userData changes
	$effect(() => {
		const newUserData = $userData;
		if (newUserData?.selection && !hasInitializedSelection) {
			selection = structuredClone(newUserData.selection); // Create a deep copy to avoid proxy issues
			selectionEdit = JSON.stringify(selection, null, 4);
			hasInitializedSelection = true;
		}
	});

	function parseSelection() {
		try {
			const parsedSelection = JSON.parse(selectionEdit);
			selection = parsedSelection;
			userData.update((data) => ({
				...data,
				selection: selection
			}));
		} catch (error) {
			selection = 'error parsing' + error;
		}
	}

	function parseCourses() {
		try {
			const parsedCourses = JSON.parse(courseEdit);
			courseData.update(() => parsedCourses);
		} catch {
			courses = 'ERROR';
		}
	}
</script>

<h1 class="mt-4">Home</h1>

{#if $authStore.currentUser}
	<h2 class="text-3xl">Current User: {$authStore.currentUser.email}</h2>

	<div class="mt-8">
		<h3 class="mb-4 text-2xl font-semibold">Test List:</h3>

		{#if $loadingUserData}
			<p class="mb-4 text-gray-600">Loading data...</p>
		{/if}
		{#if !$loadingUserData}
			<textarea class="h-96 w-96" bind:value={selectionEdit}></textarea>
			<textarea class="h-96 w-112" bind:value={courseEdit}></textarea>
		{/if}
		<button
			class="border-2 bg-blue-200 px-4 py-2"
			onclick={() => {
				saveUserData();
				saveCourseData();
			}}
		>
			Save
		</button>
		<button class="border-2 bg-green-200 px-4 py-2" onclick={parseSelection}>
			Parse Selection
		</button>
		<button class="border-2 bg-green-200 px-4 py-2" onclick={parseCourses}> Parse Courses </button>
		<p class="mt-4 text-sm text-gray-600">
			Selection data: {JSON.stringify(selection)}
		</p>
		<p class="mt-4 text-sm text-gray-600">
			Course data: {JSON.stringify(courses)}
		</p>
	</div>
{:else}
	<h2 class="text-3xl">Loading User...</h2>
{/if}
{#if isSaving}
	<svg
		class="mr-3 -ml-1 size-5 animate-spin text-black"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
		></circle><path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path></svg
	>
{:else if isSaved}
	<p class="text-2xl">Saved!</p>
{/if}

<button class="mt-4 border-2 bg-gray-200 px-4 py-2" onclick={() => auth.signOut()}>
	Sign Out
</button>
