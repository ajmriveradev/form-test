"use client"
import Image from "next/image";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeftOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const initSchema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    interest: yup.string().required(),
  })
  .required()

const secSchema = yup
  .object({
    favoriteInterest: yup.string().required(),
    acceptedTerms: yup.boolean().required(),
  })
  .required()  

type InitialFormFields = {
  email: string
  firstName: string
  lastName: string
  interest: string
}

type SecondFormFields = {
  favoriteInterest: string
  acceptedTerms: boolean
}

type Interests = "Cars" | "Music" | "Sport" | null;

const interestsList = ["Cars", "Music", "Sport"];
const carsList = ["Convertible", "Sedan", "SUV", "Other"];
const musicList = ["Folk", "Jazz", "Punk", "Other"];
const sportList = ["Baseball", "Basketball", "Football", "Ice Hockey", "Other"];

const checkBoxInterests = (interest: string) => (
  <div className="flex align-center mt-1" key={interest}>
    <RadioGroupItem value={interest} className="mr-2" />
    <Label className="font-normal">{interest}</Label>
  </div>
)

const selectItemInterests = (interest: string) => (
  <SelectItem value={interest} key={interest}>{interest}</SelectItem>
)

export default function Home() {
  const { register: registerInit, handleSubmit: handleSubmitInit, formState: { errors: errorsInit }, control: controlInit, getValues: getInitValues } = useForm<InitialFormFields>({ resolver: yupResolver(initSchema) });
  const { register: registerSec, handleSubmit: handleSubmitSec, formState: { errors: errorsSec }, control: controlSec, getValues: getSecValues } = useForm<SecondFormFields>({ resolver: yupResolver(secSchema) });
  const [interest, setInterest] = useState<Interests>(null);
  const [formPage, setFormPage] = useState<number>(1);
  const [favoriteInterestList, setFavoriteInterestList] = useState<string[]>([]);
  const [interestPlaceholder, setInterestPlaceholder] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmitInit: SubmitHandler<InitialFormFields> = async (data) => {
    const values = getInitValues();
    await handleFavoriteInterestList(values.interest);
    setFormPage(2);
  }

  const onSubmitSec: SubmitHandler<SecondFormFields> = async (data) => {
    setIsSubmitting(true);
  }

  const handleFavoriteInterestList: any = (interest: Interests) => {
    switch (interest) {
      case "Cars":
        setInterest("Cars");
        setFavoriteInterestList(carsList);
        setInterestPlaceholder("Select a car type");
        break;
      case "Music":
        setInterest("Music");
        setFavoriteInterestList(musicList);
        setInterestPlaceholder("Select a music genre");
        break;
      case "Sport":
        setInterest("Sport");
        setFavoriteInterestList(sportList);
        setInterestPlaceholder("Select a sport");
        break;
    }
  }

  const handleBackPage = () => {
    setFormPage(1);
  }

  return (
    <div className="flex justify-center mt-10">
      {
        formPage === 1 ?
        <Card className="w-[500px]">
          <form onSubmit={handleSubmitInit(onSubmitInit)}>
            <CardHeader>
              <CardTitle className="text-4xl">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label className="font-bold">Email</Label>
                  <Label className="font-semibold text-zinc-400">How we will notify you</Label>
                  <Input {...registerInit("email")} className={errorsInit.email && "border-red-600 border-2"} placeholder="i.e. johndoe@email.com" />
                  { errorsInit.email && <div className="text-red-600">{errorsInit.email.type === "required" ? "Email is required" : "Please enter a valid email"}</div>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label className="font-bold">First Name</Label>
                  <Input {...registerInit("firstName")} className={errorsInit.email && "border-red-600 border-2"} id="name" placeholder="John" />
                  { errorsInit.firstName && <div className="text-red-600">First Name is required</div> }
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label className="font-bold">Last Name</Label>
                  <Input {...registerInit("lastName")} className={errorsInit.email && "border-red-600 border-2"} placeholder="Smith" />
                  { errorsInit.lastName && <div className="text-red-600">Last Name is required</div> }
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label className="font-bold">Notify me about...</Label>
                  <Controller
                    name="interest"
                    control={controlInit}
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup
                        onValueChange={onChange}
                        defaultValue={value}
                        className="flex flex-row space-x-1"
                      >
                        {
                          interestsList.map( (interest: string) => checkBoxInterests(interest))
                        }
                      </RadioGroup>
                    )}
                  />
                  { errorsInit.interest && <div className="text-red-600">You need to select an interest</div> }
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-blue-600 font-bold" type="submit">Next</Button>
            </CardFooter>
          </form>
        </Card>
        :
        <Card className="w-[500px]">
          <form onSubmit={handleSubmitSec(onSubmitSec)}>
            <CardHeader>
              <CardTitle className="text-4xl">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1.5">
                <Label className="font-bold">Favorite {interest}</Label>
                <Label className="font-semibold text-zinc-400">Tell us more about your interest</Label>
                <Controller
                  name="favoriteInterest"
                  control={controlSec}
                  render={({ field: { onChange } }) => (
                    <Select onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={interestPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          favoriteInterestList.map( (favorite: string) => selectItemInterests(favorite))
                        }
                      </SelectContent>
                    </Select>
                  )}
                />
                { errorsSec.favoriteInterest && <div className="text-red-600">Field is required</div> }
              </div>
              <div>
                <Controller
                  name="acceptedTerms"
                  control={controlSec}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <div className="items-top flex space-x-2 mt-4">
                        <Checkbox onCheckedChange={onChange} checked={value} />
                        <label
                          className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I accept the <a className="text-blue-800 underline">Terms and Conditions</a>
                        </label>
                      </div>
                      { errorsSec.acceptedTerms && <div className="text-red-600">You must accept the terms and conditions</div> }
                    </>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="bg-zinc-100 text-zinc-600 font-bold border-zinc-400 border-2" onClick={handleBackPage} disabled={isSubmitting}><ArrowLeftOutlined className="mr-2" />Back</Button>
              <Button className={`font-bold ${isSubmitting ? "bg-zinc-100 text-zinc-600 border-zinc-400 border-2" : "bg-blue-600"}`} type="submit" disabled={isSubmitting}>{ isSubmitting ? "Please wait..." : "Next"  }</Button>
            </CardFooter>
          </form>
        </Card>
      }
    </div>
  );
}
