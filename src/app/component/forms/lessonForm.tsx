"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../comp/inputField";

import {lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { createAssignment, createExam, createLesson, updateAssignment, updateExam, updateLesson } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LessonsForm =  ({
  setOpen,
  type,
  data,
  relatedData,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
    });
    const [state, formAction] = useFormState(
      type === "create" ? createLesson :updateLesson,
      {
        success: false,
        error: false,
      }
    );
  
    const onSubmit = handleSubmit((data) => {
      formAction(data);
    });

    const router = useRouter();
  
    useEffect(() => {
      if (state.success) {
        toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router, type,setOpen]);
     
    const {subjects,classes,teachers}=relatedData;
      return (
  
          <form className="flex flex-col gap-8" onSubmit={onSubmit}>
              <h1 className="text-lg font-semibold ">{type === "create" ? "Create a New Lesson" : "Update Lesson"}</h1>
              <div className="flex justify-between flex-wrap gap-4">
              <InputField
            label="Lesson Name"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
 <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("day")}
            defaultValue={data?.day}
          >
            <option value="SUNDAY">Sunday</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            
          </select>
          {errors.day?.message && (
            <p className="text-xs text-red-400">
              {errors.day.message.toString()}
            </p>
          )}
        </div>
          <InputField
            label="start Time"
            name="startTime"
            defaultValue={data?.startTime}
            register={register}
            error={errors?.startTime}
            type="datetime-local"
          />
          <InputField
            label="End Time"
            name="endTime"
            defaultValue={data?.endTime}
            register={register}
            error={errors?.endTime}
            type="datetime-local"
          />
                  {data && (
            <InputField
              label="Id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id}
              hidden
            />
          )}
 <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Class</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("classId")}
              defaultValue={data?.classes}
            >
              {classes.map(
                (item: { id: string; name: string,surname:string}) => (
                  <option
                    value={item.id}
                    key={item.id}
                    selected={data && item.id === data.itemId}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
            {errors.classId?.message && (
              <p className="text-xs text-red-400">
                {errors.classId.message.toString()}
              </p>
            )}
          </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Teacher</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("teacherId")}
              defaultValue={data?.teachers}
            >
              {teachers.map(
                (teacher: { id: string; name: string,surname:string}) => (
                  <option
                    value={teacher.id}
                    key={teacher.id}
                    selected={data && teacher.id === data.teacherId}
                  >
                    {teacher.name + " " + teacher.surname}
                  </option>
                )
              )}
            </select>
            {errors.teacherId?.message && (
              <p className="text-xs text-red-400">
                {errors.teacherId.message.toString()}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Subject</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("subjectId")}
              defaultValue={data?.subjects}
            >
              {subjects.map(
                (subject: { id: string; name: string}) => (
                  <option
                    value={subject.id}
                    key={subject.id}
                    selected={data && subject.id === data.subjectId}
                  >
                    {subject.name}
                  </option>
                )
              )}
            </select>
            {errors.subjectId?.message && (
              <p className="text-xs text-red-400">
                {errors.subjectId.message.toString()}
              </p>
            )}
          </div>
        
              </div>
  
              <button className="bg-blue-400 text-white p-2 rounded-md ">{type === "create" ? "Create" : "Update"}</button>
          </form>
      )
  }
  export default LessonsForm;