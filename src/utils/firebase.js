import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { firebaseApp, auth, db, storage } from "../../firebaseConfig";
import { collection, addDoc, query, where, getDocs, updateDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { scheduleUserHabitNotification } from './Notification';

export const login = async ({ email, password }) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return user;
    } catch (error) {
        console.error('Login failed:', error.message);
        throw error;
    }
};

const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => reject(new TypeError('Network request failed'));
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const user = auth.currentUser;
    if (!user) {
        throw new Error('No authenticated user found');
    }
    const storageRef = ref(storage, `/profile/${user.uid}/photo.png`);
    const snapshot = await uploadBytes(storageRef, blob, { contentType: 'image/png' });

    blob.close();
    return await getDownloadURL(snapshot.ref);
};

export const signup = async ({ email, password, name, photoUrl }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const storageUrl = typeof photoUrl === 'string' && photoUrl.startsWith('https')
            ? photoUrl
            : await uploadImage(photoUrl);

        await updateProfile(user, {
            displayName: name,
            photoURL: storageUrl,
        });

        return user;
    } catch (error) {
        console.error('회원가입 오류:', error.message);
        throw error;
    }
};

export const getCurrentUser = () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No authenticated user found');
    }
    const { uid, displayName, email, photoURL } = user;
    return { uid, name: displayName, email, photoUrl: photoURL };
};

export const updateUserPhoto = async (photoUrl) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No authenticated user found');
    }
    const storageUrl = typeof photoUrl === 'string' && photoUrl.startsWith('https')
        ? photoUrl
        : await uploadImage(photoUrl);

    await updateProfile(user, { photoURL: storageUrl });
    return { name: user.displayName, email: user.email, photoUrl: user.photoURL };
};

export const addHabit = async (habitData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("로그인된 사용자가 없습니다.");

        const docRef = await addDoc(collection(db, "habits"), {
            ...habitData,
            userId: user.uid, // 로그인한 사용자 ID 추가
            createdAt: new Date(),
        });
        console.log(`[습관 추가 성공] 문서 ID: ${docRef.id}`);
        
        await scheduleUserHabitNotification(habitData);

        return { id: docRef.id, ...habitData };
    } catch (error) {
        console.error("습관 추가 실패:", error.message);
        throw error;
    }
};

export const getHabit = async (userId) => {
    try {
        const q = query(collection(db, "habits"), where("userId", "==", userId));
        const snapshot = await getDocs(q);

        const habits = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isCompleted: doc.data().isCompleted ?? false,
        }));

        console.log(`[습관 조회 성공] 조회된 습관 수: ${habits.length}`);
        return habits;
    } catch (error) {
        console.error("습관 조회 실패:", error.message);
        throw error;
    }
};

export const updateHabit = async (habitId, newProgress) => {
    try {
        const habitRef = doc(db, "habits", habitId);

        // 문서 존재 여부 확인
        const docSnapshot = await getDoc(habitRef);
        if (!docSnapshot.exists()) {
            throw new Error(`문서를 찾을 수 없습니다. ID: ${habitId}`);
        }

        // Firestore에서 문서 업데이트
        await updateDoc(habitRef, { progress: newProgress });

        // 업데이트된 문서 데이터를 가져와 반환
        const updatedDoc = await getDoc(habitRef);
        console.log(`[습관 진행률 업데이트 성공] 문서 ID: ${habitId}`);
        return { id: habitId, ...updatedDoc.data() };
    } catch (error) {
        console.error("[습관 진행률 업데이트 실패]:", error.message);
        throw error;
    }
};

export const deleteHabit = async (habitId) => {
    try {
        const habitRef = doc(db, "habits", habitId);

        // 문서 삭제
        await deleteDoc(habitRef);
        console.log(`[습관 삭제 성공] 문서 ID: ${habitId}`);
    } catch (error) {
        console.error("[습관 삭제 실패]:", error.message);
        throw error;
    }
};

export const updateCheckboxState = async (habitId, checkboxes, date) => {
    try {
        const habitRef = doc(db, "habits", habitId);
        await updateDoc(habitRef, {
            checkboxes,
            lastUpdatedDate: date,
        });
        console.log("체크박스 상태가 업데이트되었습니다.");
    } catch (error) {
        console.error("체크박스 상태 업데이트 실패:", error.message);
    }
};

export const getCheckboxState = async (habitId) => {
    try {
        const habitRef = doc(db, "habits", habitId);
        const snapshot = await getDoc(habitRef);
        if (snapshot.exists()) {
            const data = snapshot.data();
            return {
                checkboxes: data.checkboxes || [],
                lastUpdatedDate: data.lastUpdatedDate || null,
            };
        }
        return null;
    } catch (error) {
        console.error("체크박스 상태 불러오기 실패:", error.message);
        return null;
    }
};

export const updateHabitCompletionStatus = async (habitId, isCompleted) => {
    try {
        const habitRef = doc(db, "habits", habitId); // Firestore `doc` 참조 방식으로 수정
        await updateDoc(habitRef, { isCompleted });
        console.log(`[습관 완료 상태 업데이트 성공] 문서 ID: ${habitId}, isCompleted: ${isCompleted}`);
    } catch (error) {
        console.error("[습관 완료 상태 업데이트 실패]:", error.message);
        throw error;
    }
};