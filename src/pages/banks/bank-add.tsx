import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import React from "react";
import { Bank } from "../../interfaces/Bank";
import * as yup from "yup";
import { useLocation } from "react-router";
import FormComponent from "../../components/FormComponent";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseDriver";
import { useForm } from "react-hook-form";
import { goToPage, logMsg } from "../../utils/commons";
import { updateReload } from "../../reducers/bankReducer";
import { useAppDispatch } from "../../hooks";

export const BankAdd: React.FC = () => {

  const collectionName = "banks"
  
  const formFields = [
    {
      name:'name',
      type:'text',
      label:'Bank Name'
    },
    {
      name:'lastDigits',
      type:'text',
      label:'Last Digits'
    },
    {
      name:'balance',
      type:'number',
      label:'Balance'
    },
    {
      name:'isExpenseAccount',
      type:'checkbox',
      label:'Expense Account'
    },
    {
      name:'isActive',
      type:'checkbox',
      label:'Active Bank?'
    }
  ]
  

  const addBankSchema = yup.object().shape({
    name: yup.string().required("Please provide Account Name"),
    lastDigits: yup.string().required("Please provide last digits of account"),
    balance: yup
      .number()
      .required("Please enter starting balance")
      .typeError("Balance should be a number")
  });

  const location = useLocation();
  const dispatch = useAppDispatch();

  const pageData:Partial<Bank> = location.state? location.state: {};
  const pageTitle = Object.keys(pageData).length > 0? "Update Bank": "Add Bank";
  const router = useIonRouter();

  const banksRef = collection(db, collectionName);

  const addBank = async (data: Bank) => {
    await addDoc(banksRef, {data})
  }

  const updateBankByID = async (bankId: string, bankData: Bank) => {
    if (bankId) {
      try {
        const docRef = doc(db, collectionName, bankId); // Get a reference to the document
        const {id, ...updateData} = bankData;
        await setDoc(docRef, {data : updateData}, { merge: true });
      } catch (error) {
        console.error("Error updating or creating document:", error);
      }
    }
  }

  const handleSubmit = (data:Bank) => {
    logMsg("Page Default Data :- " + JSON.stringify(pageData))
    
    if(data)
    {
      logMsg(JSON.stringify(data));
      if (pageData && pageData.id)
      {
        updateBankByID(pageData.id, data)
        router.goBack();
      }
      else
      {
        addBank(data)
        goToPage(router, "/dashboard")
      }

      dispatch(updateReload(true));
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>{pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
            <IonTitle size="large">{pageTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <FormComponent
          formFields={formFields} 
          validationSchema={addBankSchema} 
          onSubmit={handleSubmit} 
          submitBtnName={Object.keys(pageData).length > 0? "Update Bank": "Add Bank"}
          defaultValues={pageData}
        />

      </IonContent>
    </IonPage>
  );
};
