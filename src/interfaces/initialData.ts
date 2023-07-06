export default interface InitialData {
    logo: string
    bg_image: string
    is_logged_in: false | number
    userID: string
    redirectUrl: string
    firebaseConfig: {
        apiKey: string
        authDomain: string
        databaseURL: string
        projectId: string
        storageBucket: string
        messagingSenderId: string
        appId: string
        measurementId: string
    }
}