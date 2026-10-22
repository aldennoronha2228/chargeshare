import * as THREE from 'three';

export type StoryChapterId =
  | 'discover'
  | 'connect'
  | 'find'
  | 'book'
  | 'share'
  | 'safety'
  | 'conversion';

export interface CameraKeyframe {
  id: StoryChapterId;
  label: string;
  chapterNumber: string;
  position: [number, number, number];
  target: [number, number, number];
  networkWeight: number;
}

export const CHAPTER_KEYFRAMES: Record<StoryChapterId, CameraKeyframe> = {
  discover: {
    id: 'discover',
    chapterNumber: '01',
    label: 'Discover',
    position: [3.6, 2.55, 5.6],
    target: [0.25, 1.15, -0.35],
    networkWeight: 0.35,
  },
  connect: {
    id: 'connect',
    chapterNumber: '02',
    label: 'Connect',
    position: [0.5, 13.5, 16.5],
    target: [0.0, 0.5, 1.0],
    networkWeight: 1.0,
  },
  find: {
    id: 'find',
    chapterNumber: '03',
    label: 'Find',
    position: [-6.8, 7.2, 11.4],
    target: [0.5, 0.9, 0.2],
    networkWeight: 0.85,
  },
  book: {
    id: 'book',
    chapterNumber: '04',
    label: 'Book',
    position: [3.1, 1.85, 2.35],
    target: [1.75, 1.45, -0.55],
    networkWeight: 0.4,
  },
  share: {
    id: 'share',
    chapterNumber: '05',
    label: 'Earn',
    position: [-4.5, 3.8, 5.8],
    target: [1.4, 1.6, -1.1],
    networkWeight: 0.95,
  },
  safety: {
    id: 'safety',
    chapterNumber: '06',
    label: 'Safety',
    position: [3.8, 2.1, 1.4],
    target: [2.3, 1.75, -0.86],
    networkWeight: 0.3,
  },
  conversion: {
    id: 'conversion',
    chapterNumber: '07',
    label: 'Start',
    position: [6.2, 4.4, 8.2],
    target: [0.2, 1.2, -0.4],
    networkWeight: 0.9,
  },
};

export const ORDERED_CHAPTERS: StoryChapterId[] = [
  'discover',
  'connect',
  'find',
  'book',
  'share',
  'safety',
  'conversion',
];

// Pre-allocated module-scope vectors to guarantee zero GC allocations in the render loop
const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();

export class ScrollSceneController {
  private currentPos = new THREE.Vector3(3.6, 2.55, 5.6);
  private currentTarget = new THREE.Vector3(0.25, 1.15, -0.35);
  private activeChapter: StoryChapterId = 'discover';
  private pointerX = 0;
  private pointerY = 0;
  public currentNetworkWeight = 0.25;

  public setChapter(chapter: StoryChapterId) {
    this.activeChapter = chapter;
  }

  public getChapter(): StoryChapterId {
    return this.activeChapter;
  }

  public setPointerNormalized(nx: number, ny: number) {
    this.pointerX = THREE.MathUtils.clamp(nx, -1, 1);
    this.pointerY = THREE.MathUtils.clamp(ny, -1, 1);
  }

  public updateCamera(camera: THREE.PerspectiveCamera, delta: number, reducedMotion: boolean) {
    const kf = CHAPTER_KEYFRAMES[this.activeChapter] || CHAPTER_KEYFRAMES.discover;

    const parallaxX = reducedMotion ? 0 : this.pointerX * 0.45;
    const parallaxY = reducedMotion ? 0 : this.pointerY * 0.25;

    _desiredPos.set(
      kf.position[0] + parallaxX,
      kf.position[1] + parallaxY,
      kf.position[2]
    );
    _desiredTarget.set(kf.target[0], kf.target[1], kf.target[2]);

    const dampLambda = reducedMotion ? 20 : 4.2;
    this.currentPos.x = THREE.MathUtils.damp(this.currentPos.x, _desiredPos.x, dampLambda, delta);
    this.currentPos.y = THREE.MathUtils.damp(this.currentPos.y, _desiredPos.y, dampLambda, delta);
    this.currentPos.z = THREE.MathUtils.damp(this.currentPos.z, _desiredPos.z, dampLambda, delta);

    this.currentTarget.x = THREE.MathUtils.damp(
      this.currentTarget.x,
      _desiredTarget.x,
      dampLambda,
      delta
    );
    this.currentTarget.y = THREE.MathUtils.damp(
      this.currentTarget.y,
      _desiredTarget.y,
      dampLambda,
      delta
    );
    this.currentTarget.z = THREE.MathUtils.damp(
      this.currentTarget.z,
      _desiredTarget.z,
      dampLambda,
      delta
    );

    this.currentNetworkWeight = THREE.MathUtils.damp(
      this.currentNetworkWeight,
      kf.networkWeight,
      dampLambda,
      delta
    );

    camera.position.copy(this.currentPos);
    camera.lookAt(this.currentTarget);
  }
}
