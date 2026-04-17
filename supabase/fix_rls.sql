-- Consolidate all RLS and Trigger fixes for a seamless experience

-- 1. EXTEND PROFILES TRIGGER TO INCLUDE ROLE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'member')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. WORKSPACES: ANYONE AUTHENTICATED CAN CREATE
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON workspaces;
CREATE POLICY "Users can view workspaces they are members of" ON workspaces
  FOR SELECT TO authenticated USING (
    owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = workspaces.id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Any authenticated user can create a workspace" ON workspaces;
CREATE POLICY "Any authenticated user can create a workspace" ON workspaces
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their workspaces" ON workspaces
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

-- 3. WORKSPACE MEMBERSHIP AUTOMATION
CREATE OR REPLACE FUNCTION public.handle_new_workspace()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_workspace_created ON public.workspaces;
CREATE TRIGGER on_workspace_created
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_workspace();

-- 4. PROJECTS: ANY MEMBER CAN VIEW, ADMIN/MANAGER/MEMBER CAN CREATE
DROP POLICY IF EXISTS "Members can view projects" ON projects;
CREATE POLICY "Members can view projects" ON projects
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = projects.workspace_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Workspace writers can create projects" ON projects;
CREATE POLICY "Workspace writers can create projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = projects.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'manager', 'member')
    )
  );

-- 5. TASKS: ANY MEMBER CAN VIEW/CREATE/UPDATE
DROP POLICY IF EXISTS "Members can view tasks" ON tasks;
CREATE POLICY "Members can view tasks" ON tasks
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = tasks.workspace_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Members can create tasks" ON tasks;
CREATE POLICY "Members can create tasks" ON tasks
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = tasks.workspace_id AND user_id = auth.uid() AND role IN ('admin', 'manager', 'member'))
  );

DROP POLICY IF EXISTS "Members can update tasks" ON tasks;
CREATE POLICY "Members can update tasks" ON tasks
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = tasks.workspace_id AND user_id = auth.uid() AND role IN ('admin', 'manager', 'member'))
  );

-- 6. COMMENTS: PERMISSIONS
DROP POLICY IF EXISTS "Members can view comments" ON comments;
CREATE POLICY "Members can view comments" ON comments
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN workspace_members ON tasks.workspace_id = workspace_members.workspace_id
      WHERE tasks.id = comments.task_id AND workspace_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can post comments" ON comments;
CREATE POLICY "Members can post comments" ON comments
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN workspace_members ON tasks.workspace_id = workspace_members.workspace_id
      WHERE tasks.id = comments.task_id AND workspace_members.user_id = auth.uid()
    )
  );
