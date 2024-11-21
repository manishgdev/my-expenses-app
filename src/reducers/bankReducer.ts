import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Bank } from "../interfaces/Bank";
import { db }  from '../firebaseDriver';
import { FirestoreDocument } from '../types';
import { addDoc, collection, getDoc, getDocs } from "firebase/firestore";
import { logMsg } from "../utils/commons";

interface BankState {
    banks: Bank[]
    loading: boolean
    reload: boolean
}

const initialState : BankState = {
    banks: [],
    loading: false,
    reload: true
}

const banksRef = collection(db, "banks");

const bankSlice = createSlice({
    name: 'banks',
    initialState,
    reducers: {
        updateLoading: (state, action) => {
            state.loading = action.payload
        },
        updateReload: (state, action) => {
            state.reload = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllBanks.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllBanks.fulfilled, (state, action) => {
            state.loading = false;
            logMsg("fetch all banks request completed")
            logMsg(JSON.stringify(action.payload))
            state.banks = action.payload
        })
        .addCase(fetchAllBanks.rejected, (state, action) => {
            state.loading = true;
        })
    }
})

const mapFirestoreDocumentsToBanks = (documents: FirestoreDocument[]): Bank[] => {
    
    // logMsg("Banks FirestoreDocument : " + JSON.stringify(documents))

    return documents.map((doc) => {
        const data = doc.data().data;
        // logMsg(JSON.stringify(data))
        return {
        
        id: doc.id, // Using FirestoreDocument's `id`
        name: data.name,
        lastDigits: data.lastDigits,
        balance: data.balance,
        isExpenseAccount: data.isExpenseAccount,
        isActive: data.isActive,
        };
    });
};

export default bankSlice.reducer;
export const {updateLoading, updateReload} = bankSlice.actions

export const fetchAllBanks = createAsyncThunk(
    'banks/fetchAllBanks',
    async (_, { rejectWithValue }) => {
        logMsg("Fetch All banks invoked")
        try {
            const snapshot = await getDocs(banksRef)
            
            return mapFirestoreDocumentsToBanks(snapshot.docs)
        } catch (error) {
            return rejectWithValue('Failed to fetch data');
        }
    }
)

