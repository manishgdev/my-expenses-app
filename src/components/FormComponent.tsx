import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IonButton, IonInput, IonCheckbox, IonDatetime, IonItem, IonText, IonLabel, IonDatetimeButton, IonModal, IonSelect, IonSelectOption } from '@ionic/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface SelectOption {
  val:string;
  displayText:string;
}

interface FormField {
  name: string;
  type: string;
  label: string;
  values?: SelectOption[];
}

interface MyFormProps {
  formFields: FormField[];
  validationSchema: yup.ObjectSchema<any>;
  onSubmit: SubmitHandler<any>;
  submitBtnName?: string;
  defaultValues?: Record<string, any>;
}

const FormComponent: React.FC<MyFormProps> = ({ formFields, validationSchema, onSubmit, submitBtnName, defaultValues }) => {
  const { handleSubmit, register, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formFields.map((field) => (
        <React.Fragment key={field.name}>
          <IonItem>
            
            {(field.type === 'text' || field.type === 'number')  && (
              <IonInput
                label={field.label}
                labelPlacement='floating'
                type={field.type}
                aria-label={field.label}
                {...register(field.name)}
                defaultValue={defaultValues? defaultValues[field.name]:""}
              />
            )}

            {field.type === 'date' && (
              <>
              <IonLabel>{field.label}</IonLabel>
              <IonDatetimeButton datetime={field.name} ></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime 
                  id={field.name} 
                  presentation='date' 
                  preferWheel={true}
                  onIonChange={(e) => setValue(field.name, e.target.value)}
                  value={defaultValues? defaultValues[field.name]: null}
                ></IonDatetime>
              </IonModal>
              </>
            )}
            
            {field.type === 'checkbox' && (
              <IonCheckbox
                labelPlacement='end'
                checked={defaultValues? defaultValues[field.name]: false}
                {...register(field.name)}
                onIonChange={(e) => {
                  setValue(field.name, e.target.checked);
                  if(defaultValues) defaultValues[field.name]=e.target.checked;
                }}
              >{field.label}</IonCheckbox>
            )}

            {field.type === 'single-select' && (
              <IonSelect 
                label={field.label} 
                labelPlacement="floating"
                {...register(field.name)}
                value={defaultValues && defaultValues[field.name]? defaultValues[field.name]:""}
                onIonChange={(e) => {
                  setValue(field.name, e.target.value);
                  if(defaultValues) defaultValues[field.name]=e.target.value;
                }}
              >
                {field.values?.map((item:SelectOption, key:number) => (
                  <IonSelectOption value={item.val}>{item.displayText.toUpperCase()}</IonSelectOption>
                ))}
              </IonSelect>
            )}

            {field.type === 'multi-select' && (
              <IonSelect 
                multiple
                interface="popover"
                label={field.label} 
                labelPlacement="floating"
                {...register(field.name)}
                value={defaultValues && defaultValues[field.name]? defaultValues[field.name]:""}
                onIonChange={(e) => {
                  setValue(field.name, e.target.value);
                  if(defaultValues) defaultValues[field.name]=e.target.value;
                }}
              >
                {field.values?.map((item:SelectOption, key:number) => (
                  <IonSelectOption value={item.val}>{item.displayText.toUpperCase()}</IonSelectOption>
                ))}
              </IonSelect>
            )}

            {/* {errors && errors[field.name] && (<p>{ errors[field.name]?.message }</p>}) */}
            
          </IonItem>
          {errors && errors[field.name] && (
            <IonText color="danger" className="ion-padding-start">
              <small>{errors[field.name]? <>{errors[field.name]?.message}<br/></>: ""}</small>
            </IonText>
          )}
        </React.Fragment>
      ))}
      
      <IonButton type="submit">{submitBtnName? submitBtnName: "Submit"}</IonButton>
      
    </form>
  );
};

export default FormComponent;
