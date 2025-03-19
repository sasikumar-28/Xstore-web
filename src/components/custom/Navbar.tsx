import { getRoute } from "@/navigation/sideBarNavigation";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { RouteParameter } from "@/type/route-type";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Navbar = () => {
  const navigate = useNavigate();
  const route: RouteParameter[] = getRoute();
  const [show, setShow] = useState(true);

  return (
    <>
      <Sheet open={show} onOpenChange={setShow}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary -rotate-90 bg-white rounded-full shadow-md m-2"
            onClick={() => setShow(!show)}
          >
            <Icon icon="ooui:expand" width="20" height="20" />
          </Button>
        </SheetTrigger>
        <SheetContent className="mt-16 h-[calc(100vh-8rem)]">
          <SheetHeader>
            <SheetTitle className="text-2xl font-semibold tracking-wide flex justify-between">
              <div>ASPIRE's AI</div>
              <div
                onClick={() => setShow(!show)}
                className="rotate-90 cursor-pointer"
              >
                <Icon icon="ooui:expand" width="20" height="20" />
              </div>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[calc(100vh-100px)]">
            <Accordion type="multiple" className="space-y-4">
              {route.map((item, index) =>
                item?.children ? (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className="text-lg font-medium text-primary flex justify-between focus:outline-none"
                      style={{ border: "none" }}
                    >
                      {item?.link ? (
                        <div
                          onClick={() => navigate(String(item?.link))}
                          className="w-full text-left"
                        >
                          {item.name}
                        </div>
                      ) : (
                        item.name
                      )}
                    </AccordionTrigger>
                    <AccordionContent className="ml-4 space-y-2">
                      {item.children?.map((child, index) =>
                        child.children ? (
                          <AccordionItem
                            key={index}
                            value={`child-${index}`}
                            style={{ borderBottom: "none" }}
                          >
                            <AccordionTrigger
                              className="text-sm text-muted-foreground flex justify-between"
                              style={{ textDecoration: "none" }}
                            >
                              {child.link ? (
                                <div
                                  onClick={() => navigate(String(child?.link))}
                                  className="w-full text-left"
                                >
                                  {child.name}
                                </div>
                              ) : (
                                child.name
                              )}
                            </AccordionTrigger>
                            <AccordionContent className="ml-6 space-y-1">
                              {child.children?.map((subChild, e) => (
                                <div
                                  key={e}
                                  className="text-xs text-muted-foreground hover:text-primary transition"
                                >
                                  {subChild.link ? (
                                    <div
                                      className="cursor-pointer hover:underline"
                                      onClick={() =>
                                        navigate(String(subChild?.link))
                                      }
                                    >
                                      {subChild.name}
                                    </div>
                                  ) : (
                                    <div className="text-sm font-medium">
                                      {subChild.name}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        ) : (
                          <div
                            key={index}
                            className="cursor-pointer hover:underline text-sm text-muted-foreground flex justify-between"
                            onClick={() => navigate(String(child?.link))}
                            style={{ fontWeight: 500 }}
                          >
                            {child.name}
                          </div>
                        )
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => navigate(String(item?.link))}
                  >
                    {item.name}
                  </div>
                )
              )}
            </Accordion>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Navbar;
