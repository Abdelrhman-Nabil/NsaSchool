"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../comp/inputField";
import { assignmentSchema,AssignmentSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { createAssignment, createExam, updateAssignment, updateExam } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AssignmentForm =  ({
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
    } = useForm<AssignmentSchema>({
        resolver: zodResolver(assignmentSchema),
    });
    const [state, formAction] = useFormState(
      type === "create" ? createAssignment :updateAssignment,
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
        toast(`Assignment has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router, type,setOpen]);
     
    const {lessons}=relatedData;
      return (
  
          <form className="flex flex-col gap-8" onSubmit={onSubmit}>
              <h1 className="text-lg font-semibold ">{type === "create" ? "Create a New Assignment" : "Update Assignment"}</h1>
              <div className="flex justify-between flex-wrap gap-4">
              <InputField
            label="Exam title"
            name="title"
            defaultValue={data?.title}
            register={register}
            error={errors?.title}
          />
          <InputField
            label="Start Date"
            name="startDate"
            defaultValue={data?.startDate.toISOString().split("T")[0]}
            register={register}
            error={errors?.startDate}
            type="datetime-local"
          />
          <InputField
            label="End Date"
            name="dueDate"
            defaultValue={data?.dueDate.toISOString().split("T")[0]}
            register={register}
            error={errors?.dueDate}
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
            <label className="text-xs text-gray-500">Lesson</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("lessonId")}
              defaultValue={data?.lessonId}
            >
              {lessons.map(
                (lesson: { id: string; name: string;}) => (
                  <option
                    value={lesson.id}
                    key={lesson.id}
                    selected={data && lesson.id === data.lessonId}
                  >
                    {lesson.name}
                  </option>
                )
              )}
            </select>
            {errors.lessonId?.message && (
              <p className="text-xs text-red-400">
                {errors.lessonId.message.toString()}
              </p>
            )}
          </div>
              </div>
  
              <button className="bg-blue-400 text-white p-2 rounded-md ">{type === "create" ? "Create" : "Update"}</button>
          </form>
      )
  }
  export default AssignmentForm