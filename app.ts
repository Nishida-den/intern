import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private material: THREE.Material;
    private head: THREE.Mesh;
    private rightEye: THREE.Mesh;
    private leftEye: THREE.Mesh;
    private mouth: THREE.Mesh;
    private rightLeg: THREE.Mesh;
    private leftLeg: THREE.Mesh;
    private rightHand: THREE.Mesh;
    private leftHand: THREE.Mesh;
    private light: THREE.Light;
    private jumping: boolean = false; // ジャンプフラグ
    private clock: THREE.Clock;

    constructor() {
        this.clock = new THREE.Clock();
    }

    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));

        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = () => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    private createScene = () => {
        this.scene = new THREE.Scene();

        //// カービィの頭部
        this.material = new THREE.MeshBasicMaterial({ color: 0xffc0cb });
        this.head = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 32), this.material);
        this.scene.add(this.head);



        //// カービィの目

        // 黒目の作成
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        // 楕円形の目のジオメトリを作成
        const eyeGeometry = new THREE.EllipseCurve(
            0,
            0,
            2,
            3,
            0,
            Math.PI * 2,
            false,
            0
        );
        const eyePoints = eyeGeometry.getPoints(20);
        const eyeShape = new THREE.Shape(eyePoints); //形
        const eyeGeometry2 = new THREE.ExtrudeGeometry(eyeShape, {
            depth: 1, // 押し出しの程度
            bevelEnabled: false, // ベベルを無効化
          });
          
        //右目
        this.rightEye = new THREE.Mesh(eyeGeometry2, eyeMaterial);
        this.rightEye.position.set(-3, 4, 14.4);
        this.scene.add(this.rightEye);
        //左目
        this.leftEye = new THREE.Mesh(eyeGeometry2, eyeMaterial);
        this.leftEye.position.set(3, 4, 14.4);
        this.scene.add(this.leftEye);


        // 白目
        const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        // 白目のジオメトリを作成
        const eyeWhiteGeometry = new THREE.EllipseCurve(
            0,
            0,
            1,
            1.5,
            0,
            Math.PI * 2,
            false,
            0
        );
        const eyeWhitePoints = eyeWhiteGeometry.getPoints(20);
        const eyeWhiteShape = new THREE.Shape(eyeWhitePoints);
        const eyeWhiteGeometry2 = new THREE.ShapeGeometry(eyeWhiteShape);

        //右目
        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry2, eyeWhiteMaterial);
        rightEyeWhite.position.set(0.1, 1, 1.1);
        this.rightEye.add(rightEyeWhite);
        //左目
        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry2, eyeWhiteMaterial);
        leftEyeWhite.position.set(-0.1, 1, 1.1);
        this.leftEye.add(leftEyeWhite);



        //// カービィの口
        const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mouth = new THREE.Mesh(new THREE.TorusGeometry(2, 0.3, 5, 10, -3), mouthMaterial);
        this.mouth.position.set(0, 0, 15.1);
        this.scene.add(this.mouth);



        //// カービィの足
        const legMaterial = new THREE.MeshBasicMaterial({ color: 0xff6781 });
        const legGeometry = new THREE.SphereBufferGeometry(6, 32, 32, 32, 10); //足のgeometry
        //右足
        this.rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.rightLeg.position.set(-9.5, -12, 0);
        this.scene.add(this.rightLeg);
        //左足
        this.leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.leftLeg.position.set(9.5, -12, 0);
        this.scene.add(this.leftLeg);



        ////カービィの手

        //手の設定
        const handMaterial = new THREE.MeshBasicMaterial({ color: 0xffc0cb }); //マテリアル
        const handGeometry = new THREE.SphereGeometry(6, 10, 10); //ジオメトリー

        //右手
        this.rightHand = new THREE.Mesh(handGeometry, handMaterial);
        this.rightHand.position.set(-15, 0, 0);
        this.head.add(this.rightHand);
        //左手
        this.leftHand = new THREE.Mesh(handGeometry, handMaterial);
        this.leftHand.position.set(15, 0, 0);
        this.head.add(this.leftHand);



        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(1, 1, 1).normalize();
        this.scene.add(this.light);

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = () => {
            const delta = this.clock.getDelta();
            const time = this.clock.getElapsedTime();
            

            // 頭部の回転
            this.head.rotation.y = Math.sin(time) * 0.2;

            // 足の伸縮
            this.rightLeg.scale.y = 1 + Math.sin(time * 2) * 0.3;
            this.leftLeg.scale.y = 1 + Math.sin(time * 2) * 0.3;

            // 手の位置
            this.rightHand.position.y = Math.sin(time * 2) * 4;
            this.leftHand.position.y = Math.sin(time * 2 + Math.PI) * 4;

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}


window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 5, 50));
    document.body.appendChild(viewport);
}