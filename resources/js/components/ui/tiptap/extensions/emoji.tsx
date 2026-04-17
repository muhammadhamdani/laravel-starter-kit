import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import { SmileIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToolbar } from "../toolbars/toolbar-provider";

const EmojiPicker = ({ onSelect }: { onSelect: (emoji: any) => void }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const picker = new Picker({
      data,
      theme: "light",
      onEmojiSelect: (emoji: any) => {
        onSelect(emoji);
      },
    });

    ref.current.innerHTML = "";
    ref.current.appendChild(picker as unknown as Node);

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [onSelect]);

  return <div ref={ref} className="w-full rounded-md" />;
};

export const EmojiToolbar = () => {
  const { editor } = useToolbar();

  const addEmoji = (emoji: any) => {
    editor?.chain().focus().insertContent(emoji.native).run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Insert Emoji">
          <SmileIcon className="mr-2 size-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-1 bg-white shadow-lg border rounded-md">
        <EmojiPicker onSelect={addEmoji} />
      </PopoverContent>
    </Popover>
  );
};
